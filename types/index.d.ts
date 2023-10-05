declare module '@env/client' {
  const env: {
    NEXT_PUBLIC_HYGRAPH_STAGE: string;
    NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT: string;
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: string;
    NEXT_PUBLIC_WEB3AUTH_NETWORK: string;
    NEXT_PUBLIC_WEB3AUTH_SESSION_TIME: string;
    NEXT_PUBLIC_CHAIN: string;
    NEXT_PUBLIC_ALCHEMY_API_KEY: string;
    NEXT_PUBLIC_UPLOAD_ACCOUNT_ID: string;
    NEXT_PUBLIC_UPLOAD_PATH_PREFIX: string;
    NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  };
  export default env;
}

declare module '@env/server' {
  const env: {
    NX_CLOUD_AUTH_TOKEN: string;
    NX_CACHE_DIRECTORY: string;
    HASURA_VERSION: string;
    HASURA_GRAPHQL_SERVER_PORT: number;
    HASURA_GRAPHQL_ADMIN_SECRET: string;
    HASURA_CONSOLE_PORT: number;
    HASURA_GRAPHQL_DATABASE_URL: string;
    HYGRAPH_CMS_WEBHOOK_READ_URL: string;
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE: string;
    POSTGRES_USER: string;
    POSTGRES_DB: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_PORT: number;
    HYGRAPH_STAGE: string;
    NEXT_PORT: number;
    NEXT_HOST: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    TOKEN_LIFE_TIME: string;
    THIRDWEB_MASTER_ADDRESS: string;
    THIRDWEB_MASTER_PRIVATE_KEY: string;
    THIRDWEB_SECRET_KEY: string;
    SUMSUB_API_KEY: string;
    SUMSUB_SECRET_KEY: string;
    SUMSUB_WEBHOOKS_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_API_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    KV_REST_API_URL: string;
    KV_REST_API_TOKEN: string;
    TZ: string;
  };
  export default env;
}
