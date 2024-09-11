declare module '@env/client' {
  const env: {
    NEXT_PUBLIC_APP?: string;
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: string;
    NEXT_PUBLIC_HYGRAPH_STAGE: string;
    NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT: string;
    NEXT_PUBLIC_CHAIN: string;
    NEXT_PUBLIC_ALCHEMY_API_KEY: string;
    NEXT_PUBLIC_BYTESCALE_ACCOUNT_ID: string;
    NEXT_PUBLIC_UPLOAD_PATH_PREFIX: string;
    NEXT_PUBLIC_BYTESCALE_PUBLIC_API_KEY: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_OPENZEPPELIN_URL: string;
    NEXT_PUBLIC_POSTHOG_KEY: string;
    NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL: string;
    NEXT_PUBLIC_MARKETPLACE_API_KEY: string;
    NEXT_PUBLIC_COMETH_CONNECT_API_KEY: string;
    NEXT_PUBLIC_WC_PROJECT_ID: string;
    NEXT_PUBLIC_WC_RELAY_URL: string;
    NEXT_PUBLIC_WEB_APP_URL: string;
  };
  export default env;
}

declare module '@env/server' {
  const env: {
    APP?: string;
    ALCHEMY_API_KEY: string;
    ALCHEMY_AUTH_TOKEN: string;
    CHAIN: string;
    HASURA_PROJECT_ENDPOINT: string;
    HASURA_GRAPHQL_ADMIN_SECRET: string;
    HYGRAPH_STAGE: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    TOKEN_LIFE_TIME: number;
    THIRDWEB_MASTER_ADDRESS: string;
    THIRDWEB_MASTER_PRIVATE_KEY: string;
    THIRDWEB_SECRET_KEY: string;
    THIRDWEB_CLIENT_ID: string;
    SENTRY_AUTH_TOKEN?: string;
    SENTRY_DSN?: string;
    SUMSUB_API_KEY: string;
    SUMSUB_SECRET_KEY: string;
    SUMSUB_WEBHOOKS_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_API_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    KV_REST_API_URL: string;
    KV_REST_API_TOKEN: string;
    TZ: string;
    BYTESCALE_ACCOUNT_ID: string;
    BYTESCALE_SECRET_API_KEY: string;
    BYTESCALE_SECRET_JWT: string;
    UPLOAD_PATH_PREFIX: string;
    BYTESCALE_PUBLIC_API_KEY: string;
    FIXER_CURRENCY_API_KEY: string;
    EXCHANGE_RATE_API_KEY: string;
    WEB_APP_URL?: string;
    OPENZEPPELIN_URL: string;
    POSTHOG_KEY: string;
    POSTHOG_PERSONAL_API_KEY: string;
    COMETH_CONNECT_API_KEY: string;
    API_SECRET_ENCRYPTION_KEY: string;
    SHOPIFY_API_SECRET: string;
  };
  export default env;
}
