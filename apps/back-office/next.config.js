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

const nextConfig = {
  env: {
    APP: 'BACKOFFICE',
    NEXT_PORT: '1789',
    NEXTAUTH_URL: 'http://localhost:1789',
    NEXTAUTH_SECRET:
      '-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n',
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
    serverActions: true,
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
      '@features/account/api',
      '@features/appNav',
      '@features/back-office/appNav',
      '@features/back-office/dashboard',
      '@features/cart',
      '@features/cart/server',
      '@features/kyc',
      '@features/kyc/server',
      '@features/organizer/event',
      '@features/organizer/event/server',
      '@features/pass',
      '@features/pass-api',
      '@features/pass/server',
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
    ],
    // https://vercel.com/docs/concepts/deployments/skew-protection#enabling-skew-protection
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
    typedRoutes: false, // no solution found to get it working with nx monorepo (not accessible from external libs like feature)
  },
  sentry: {
    hideSourceMaps: true,
    // TODO set back when issue fixed, meanwhile issue in api route will not be reported if not wrapped with withSentry.
    autoInstrumentServerFunctions: false, // avoid error: error ./middleware.ts Module not found: Can't resolve 'sentry.edge.config.ts'
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  org: 'offline-live',
  project: 'nextjs-back-office',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  dryRun: !SENTRY_DSN,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = async (phase, context) => {
  const addNx = withNx({
    ...nextConfig,
  });

  let config = await addNx(phase);
  config = await withSentryConfig(config, sentryWebpackPluginOptions);
  config = await withBundleAnalyzer(config);
  config = await withNextIntl(config);
  return config;
};
