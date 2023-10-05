// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import env from '@env/client';
import envServer from '@env/server';
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = envServer.SENTRY_AUTH_TOKEN
  ? null
  : envServer.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  environment: process.env.VERCEL_ENV || 'development',
  debug: false,
  enabled: !!SENTRY_DSN,
  dsn: SENTRY_DSN || undefined,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
