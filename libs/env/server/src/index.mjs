// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  server: {
    APP: z.string().optional(),
    ALCHEMY_API_KEY: z.string().min(1),
    ALCHEMY_AUTH_TOKEN: z.string().min(1),
    CHAIN: z.string(),
    NX_CLOUD_AUTH_TOKEN: z.string().min(1),
    NX_CACHE_DIRECTORY: z.string().min(1),
    HASURA_PROJECT_ENDPOINT: z.string().url(),
    HASURA_GRAPHQL_ADMIN_SECRET: z.string(),
    HYGRAPH_STAGE: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    TOKEN_LIFE_TIME: z.coerce.number(),
    THIRDWEB_MASTER_ADDRESS: z.string().min(1),
    THIRDWEB_MASTER_PRIVATE_KEY: z.string().min(1),
    THIRDWEB_SECRET_KEY: z.string().min(1),
    THIRDWEB_CLIENT_ID: z.string().min(1),
    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
    SENTRY_DSN: z.string().url().optional(),
    SUMSUB_API_KEY: z.string().min(1),
    SUMSUB_SECRET_KEY: z.string().min(1),
    SUMSUB_WEBHOOKS_SECRET_KEY: z.string().min(1),
    STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().min(1),
    UPLOAD_ACCOUNT_ID: z.string().min(1),
    UPLOAD_SECRET_API_KEY: z.string().min(1),
    UPLOAD_PATH_PREFIX: z.string().min(1),
    UPLOAD_SECRET_JWT: z.string().min(1),
    UPLOAD_PUBLIC_API_KEY: z.string().min(1),
    FIXER_CURRENCY_API_KEY: z.string().min(1),
    EXCHANGE_RATE_API_KEY: z.string().min(1),
    OPENZEPPELIN_URL: z.string().min(1),
    WEB_APP_URL: z.string().optional(),
  },
  runtimeEnv: {
    APP: process.env.APP,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    ALCHEMY_AUTH_TOKEN: process.env.ALCHEMY_AUTH_TOKEN,
    CHAIN: process.env.CHAIN,
    NX_CLOUD_AUTH_TOKEN: process.env.NX_CLOUD_AUTH_TOKEN,
    NX_CACHE_DIRECTORY: process.env.NX_CACHE_DIRECTORY,
    HASURA_PROJECT_ENDPOINT: process.env.HASURA_PROJECT_ENDPOINT,
    HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    HYGRAPH_STAGE: process.env.HYGRAPH_STAGE,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
      ? process.env.NEXTAUTH_SECRET.replace(/\\n/g, '\n')
      : process.env.NEXTAUTH_SECRET,
    TOKEN_LIFE_TIME: process.env.TOKEN_LIFE_TIME,
    THIRDWEB_MASTER_ADDRESS: process.env.THIRDWEB_MASTER_ADDRESS,
    THIRDWEB_MASTER_PRIVATE_KEY: process.env.THIRDWEB_MASTER_PRIVATE_KEY,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SUMSUB_API_KEY: process.env.SUMSUB_API_KEY,
    SUMSUB_SECRET_KEY: process.env.SUMSUB_SECRET_KEY,
    SUMSUB_WEBHOOKS_SECRET_KEY: process.env.SUMSUB_WEBHOOKS_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    UPLOAD_ACCOUNT_ID: process.env.UPLOAD_ACCOUNT_ID,
    UPLOAD_SECRET_API_KEY: process.env.UPLOAD_SECRET_API_KEY,
    UPLOAD_PATH_PREFIX: process.env.UPLOAD_PATH_PREFIX,
    UPLOAD_SECRET_JWT: process.env.UPLOAD_SECRET_JWT,
    UPLOAD_PUBLIC_API_KEY: process.env.UPLOAD_PUBLIC_API_KEY,
    FIXER_CURRENCY_API_KEY: process.env.FIXER_CURRENCY_API_KEY,
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
    OPENZEPPELIN_URL: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL,
    WEB_APP_URL: process.env.WEB_APP_URL,
  },
});

export default env;
