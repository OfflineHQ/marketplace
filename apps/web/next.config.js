/* eslint-disable @typescript-eslint/no-var-requires */
const withNx = require('@nrwl/next/plugins/with-nx');
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

const SENTRY_DSN = process.env.SENTRY_AUTH_TOKEN
  ? null
  : process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        // crypto: require.resolve('crypto-browserify'),
      };
    }
    return config;
  },
  images: {},
  // optimize build with vercel nft (node file tracing) https://nextjs.org/docs/advanced-features/output-file-tracing
  // outputFileTracingRoot needed for monorepo
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    // to fix chakra ui error with cancelSync esm import
    esmExternals: false,
    appDir: true, // TODO set to true when shared components works + nx fixed build and serve
    fontLoaders: [
      {
        loader: '@next/font/google',
        options: { subsets: ['latin'] },
      },
    ],
  },
  //
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  dryRun: !SENTRY_DSN,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withBundleAnalyzer(
  withSentryConfig(withNx(nextConfig), sentryWebpackPluginOptions)
);

module.exports = async (phase, context) => {
  const isProd = process.env.NODE_ENV === 'production';
  // Use the CDN in production and localhost for development.
  // assetPrefix: isProd() ? 'https://cdn.mydomain.com' : undefined,
  const assetPrefix = isProd && phase !== '' ? phase : undefined;
  const buildId = isProd ? `${assetPrefix.substring(1).replaceAll('/', '-')}` : '';

  const addNx = withNx({
    ...nextConfig,
    assetPrefix,
    generateBuildId: async () => buildId,
    publicRuntimeConfig: {
      assetPrefix,
    },
  });

  let config = await addNx(phase);
  // config = await nextTranslate(config);
  config = await withSentryConfig(config, sentryWebpackPluginOptions);
  config = await withBundleAnalyzer(config);
  return config;
};
