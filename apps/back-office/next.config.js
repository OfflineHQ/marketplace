/* eslint-disable @typescript-eslint/no-var-requires */
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
    NEXT_PORT: 1789,
    NEXTAUTH_URL: 'http://localhost:1789',
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
    // https://vercel.com/docs/concepts/deployments/skew-protection#enabling-skew-protection
    useDeploymentId: true,
    // If use with serverActions is desired
    serverActions: true,
    useDeploymentIdServerActions: true,
    appDir: true,
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
