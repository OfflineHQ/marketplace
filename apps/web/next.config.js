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

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
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
  transpilePackages: ['@ui/components', '@ui/theme', '@ui/icons'],
  images: {
    domains: ['media.graphassets.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/seed/hero/**',
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
      '@features/account/api',
      '@features/appNav/ui',
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
    // If use with serverActions is desired
    serverActions: true,
    useDeploymentIdServerActions: true,
    typedRoutes: false, // no solution found to get it working with nx monorepo (not accessible from external libs like feature)
  },
  sentry: {
    hideSourceMaps: true,
    // // TODO set back when issue fixed, meanwhile issue in api route will not be reported if not wrapped with withSentry.
    // autoInstrumentServerFunctions: false, // avoid error: error ./middleware.ts Module not found: Can't resolve 'sentry.edge.config.ts'
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  org: 'offline-live',
  project: 'nextjs-marketplace',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  dryRun: !SENTRY_DSN,
  silent: process.env.VERCEL_ENV === 'production',
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
};

module.exports = async (phase, context) => {
  const addNx = withNx({
    ...nextConfig,
  });

  let config = await addNx(phase);
  config = await withSentryConfig(
    config,
    sentryWebpackPluginOptions,
    sentryOptions,
  );
  config = await withBundleAnalyzer(config);
  config = await withNextIntl(config);
  return config;
};
