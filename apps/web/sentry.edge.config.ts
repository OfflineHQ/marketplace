// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

import env from '@env/client';
import envServer from '@env/server';

const SENTRY_DSN = envServer.SENTRY_AUTH_TOKEN
  ? null
  : envServer.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  environment: process.env.VERCEL_ENV || 'development',
  enabled: !!SENTRY_DSN,
  dsn: SENTRY_DSN || undefined,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.VERCEL_ENV === 'production' ? 0.2 : 1,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
