/* eslint-disable @typescript-eslint/no-var-requires */
// Import env variables for client and server, will return an error in case it's not defined.
import('../../libs/env/client/src/index.mjs');
import('../../libs/env/server/src/index.mjs');
const { withNx } = require('@nx/next');
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} nextI18n - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const SENTRY_DSN = process.env.SENTRY_AUTH_TOKEN
  ? null
  : process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
// if not running in vercel, we need to set env variables for local and ci
const env = process.env.VERCEL_ENV
  ? {}
  : {
      NEXT_PORT: '8889',
      NEXTAUTH_URL: 'http://localhost:8889',
    };
const nextConfig = {
  env: {
    APP: 'UNLOCK',
    ...env,
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // TODO set back when in 'real' prod. For now useful for debug
    // removeConsole:
    //   process.env.VERCEL_ENV === 'production' ||
    //   process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
    removeConsole: false,
    styledComponents: false,
  },
  /* could improve performance in dev but @ui components no organized like that.
  See that as ref: https://github.com/knitkode/koine/blob/3046607d655a3cfa1e3b3438f1aef168fbdc6ad5/packages/next/config/index.ts#L251
  https://nextjs.org/blog/next-13-1#import-resolution-for-smaller-bundles
  And this thread n
  + this article: https://medium.com/@yashashr/next-js-optimization-for-better-performance-part-1-material-ui-mui-configs-plugins-6fdc48a4e984
  */
  modularizeImports: {
    //Need to update structure of @ui/components to make it work
    // '@ui/components/?(((\\w*)?/?)*)': {
    //   transform: '@ui/components/{{ matches.[1] }}/{{member}}',
    // },
  },
  transpilePackages: ['@ui/components', '@ui/theme', '@ui/icons'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.graphassets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // optimize build with vercel nft (node file tracing) https://nextjs.org/docs/advanced-features/output-file-tracing
  // outputFileTracingRoot needed for monorepo
  // output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingExcludes: {
      '*': [
        'node_modules/.pnpm/@swc+core-linux-x64-musl',
        'node_modules/.pnpm/@swc+core-linux-x64-gnu',
        'node_modules/.pnpm/@esbuild+linux-x64',
        'node_modules/.pnpm/webpack',
        'node_modules/.pnpm/sass',
      ],
    },
    optimizePackageImports: [
      '@ui/icons',
      '@ui/components',
      '@insight/client',
      '@features/account/api',
      '@features/appNav',
      '@features/kyc',
      '@features/kyc/server',
      '@features/navigation',
      '@features/pass',
      '@features/pass-api',
      '@features/pass-actions',
      '@features/settings',
      '@gql/admin/api',
      '@gql/admin/types',
      '@gql/user/api',
      '@gql/user/react-query',
      '@gql/user/types',
      '@gql/anonymous/api',
      '@gql/anonymous/react-query',
      '@gql/anonymous/types',
      '@gql/shared/types',
      '@nft/thirdweb-admin',
      '@nft/thirdweb-organizer',
      '@nft/event-pass',
    ],
    typedRoutes: false, // no solution found to get it working with nx monorepo (not accessible from external libs like feature)
  },
  sentry: {
    hideSourceMaps: true,
    // TODO set back when issue fixed, meanwhile issue in api route will not be reported if not wrapped with withSentry.
    autoInstrumentServerFunctions: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  org: 'offline-live',
  project: 'nextjs-unlock',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  dryRun: !SENTRY_DSN,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};
// https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy#without-nonces
// frame-ancestors *; // Allows embedding from any origin (use carefully)
const cspHeader = `
    frame-ancestors *;
`;

const permissionsPolicy = `
publickey-credentials-get=*,
publickey-credentials-create=*
`;

module.exports = async (phase, context) => {
  const addNx = withNx({
    ...nextConfig,
    async headers() {
      // only add csp header when deployed with vercel to avoid Safari error in local
      return process.env.VERCEL_ENV && process.env.APP === 'UNLOCK'
        ? [
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'Content-Security-Policy',
                  value: cspHeader.replace(/\n/g, ''),
                },
                {
                  key: 'Permissions-Policy',
                  value: permissionsPolicy.replace(/\n/g, ''),
                },
              ],
            },
          ]
        : [];
    },
  });
  let config = await addNx(phase);
  config = await withSentryConfig(config, sentryWebpackPluginOptions);
  config = await withBundleAnalyzer(config);
  config = await withNextIntl(config);
  return config;
};
