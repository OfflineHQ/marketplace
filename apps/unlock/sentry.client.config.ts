// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

import env from '@env/client';
//
const SENTRY_DSN = env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: !!SENTRY_DSN,
  dsn: SENTRY_DSN || undefined,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 0.2 : 1,
  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 0.1 : 1,
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    // eslint-disable-next-line import/namespace
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
