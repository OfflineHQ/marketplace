/* eslint-disable @typescript-eslint/no-var-requires */
const nodeFetch = require('node-fetch');
const http = require('http');
const https = require('https');

/* fix ReferenceError: TextDecoder is not defined (or TextEncoder) */
import { TextDecoder, TextEncoder } from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
//////////////

// Set the env variables to override:

process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'password';
process.env.POSTGRES_DB = 'postgres';
process.env.POSTGRES_PORT = '5454';

process.env.HASURA_GRAPHQL_DATABASE_URL =
  'postgres://postgres:password@test-db:5454/postgres';
process.env.HASURA_GRAPHQL_SERVER_PORT = '9696';
process.env.HASURA_PROJECT_ENDPOINT = 'http://localhost:9696/v1/graphql';
process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT =
  'http://localhost:9696/v1/graphql';
process.env.NEXTAUTH_URL = 'http://localhost:8888/';
process.env.HASURA_GRAPHQL_ADMIN_SECRET = 'password';
process.env.HYGRAPH_STAGE = 'DRAFT';
process.env.HYGRAPH_CMS_WEBHOOK_READ_URL =
  'https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/cliyf1fte05rf01um257o2lim/master';
process.env.HYGRAPH_CMS_READ_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2ODczNDQzODgsImF1ZCI6WyJodHRwczovL2FwaS1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vdjIvY2xpeWYxZnRlMDVyZjAxdW0yNTdvMmxpbS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiNWI1ZjUwMWMtYjQyOC00OGY1LWI2ZGEtOTcwMWZiZDlhZjViIiwianRpIjoiY2xqNWxhNnpwMDh5ZTAxdW0wcWsyN3A1byJ9.gMlU5X5OzMHiUPB_NlsOWogmh61uNn4mdsEm83cPOAcX4hkahhJqrgva2ODjfldC7C26RbWSdxTOJH3MNn_Dc6Vl38MweNtuVivkyHirC7S_ts9apoyfr_MGyfc0UxzvGyja06ljQ78F-NlizXpFGGZKPlPwTrq0_2wY_SlY6S1YRFDMqNbmYAiQTlzzrvB0ccd0Pnjp4dQ9-gygr4SA6lBfd44w9dN31JyvX2rzMyviFb1dEh9VxWGtgw-C41JP_Fkn30SSnFt1u2lmJt848d0vxT8mzwE6hg9uPSCzcALe3AjHP95_S2BqTSGw7a43iyfDVx3UhRMCbmPWntnX95v_Ht1XB7QDEarDavYlc8cFx5g1GRxGUrh2gfeJxGki2AQIToM3uaFtuq2hJ9R70_GX5k7DOK2_P8KgzCCXozMiHIGeCtJ6O5MGjA1U3AUOSw4F78u7AL9bid8g-v8zuAMEl7zBCcErqgKdcp28ehesDXEY0vBk9p5VfWpW_jNspD6G7hMg1gKCyYa2d4px-2Ftr3OpKnu9cSKQkKWWB_UvwNKZcZy1q0fI5hzz3wcLnsMiT_qHf8JBvXJ7wzOJBR2YTd1HsWv66NOVGESacUGRqUcsgR4ZjQHbWOxMcgsk3fe5oAKR3zDMR_CCWi3Q17s9_0z155GBGm-GPb0mjgE';

// # vercel/kv
process.env.KV_REST_API_URL = 'http://localhost:7070';
process.env.KV_REST_API_TOKEN = 'example_token_test';

// ## timezone
process.env.TZ = 'Europe/London';

process.env.ALCHEMY_API_KEY = 'fake-key';
process.env.ALCHEMY_AUTH_TOKEN = 'fake-token';
process.env.THIRDWEB_CLIENT_ID = 'fake-client-id';
process.env.THIRDWEB_CLIENT_SECRET = 'fake-client-secret';
process.env.SUMSUB_API_KEY = 'fake-sumsub-api-key';
process.env.SUMSUB_SECRET_KEY = 'fake-sumsub-secret-key';
process.env.SUMSUB_WEBHOOKS_SECRET_KEY = 'fake-sumsub-webhooks-secret-key';
process.env.STRIPE_PUBLISHABLE_KEY = 'fake-stripe-publishable-key';
process.env.STRIPE_API_KEY = 'fake-stripe-secret-key';
process.env.STRIPE_WEBHOOK_SECRET = 'fake-api-secret-encryption-key';
process.env.BYTESCALE_ACCOUNT_ID = 'fake-upload-account-id';
process.env.BYTESCALE_SECRET_API_KEY = 'fake-upload-secret-api-key';
process.env.UPLOAD_PATH_PREFIX = 'fake-upload-path-prefix';
process.env.BYTESCALE_SECRET_JWT = 'fake-upload-secret-jwt';
process.env.BYTESCALE_PUBLIC_API_KEY = 'fake-upload-public-api-key';
process.env.FIXER_CURRENCY_API_KEY = 'fake-fixer-currency-api-key';
process.env.EXCHANGE_RATE_API_KEY = 'fake-exchange-rate-api-key';
process.env.OPENZEPPELIN_URL = 'https://fake-openzeppelin-url.com';
process.env.POSTHOG_KEY = 'fake-posthog-key';
process.env.POSTHOG_PERSONAL_API_KEY = 'fake-posthog-personal-api-key';
process.env.COMETH_CONNECT_API_KEY = 'fake-cometh-connect-api-key';

//////////////

// used to avoid the error: Attempted to access a server-side environment variable on the client, because it doesn't know it's not on the server in jest.
jest.mock('@t3-oss/env-nextjs', () => ({
  createEnv: (env: any) => env.runtimeEnv,
}));

// Set the global agent options for node-fetch to avoid connection errors, see https://github.com/node-fetch/node-fetch/issues/1735

// Create HTTP and HTTPS agents with keepAlive set to true
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

// Define a function that selects the appropriate agent based on the URL
const agentSelector = (parsedURL: any) => {
  if (parsedURL.protocol == 'http:') {
    return httpAgent;
  } else {
    return httpsAgent;
  }
};

// Create a wrapper function for node-fetch that uses the agent selector
const customFetch = (url: URL | RequestInfo, options: any) => {
  const parsedURL = new URL(url as string);

  // If no options object has been defined, create one
  if (!options) {
    options = {};
  }

  // Apply the custom agent to the options
  options.agent = agentSelector(parsedURL);

  // Call node-fetch with the updated options
  return nodeFetch(url, options);
};

// Set fetch to be the global fetch function
global.fetch = customFetch;

// Set Request, Response, Headers to be global
global.Request = nodeFetch.Request;
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;

jest.mock('@formkit/auto-animate/react');

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return null;
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
global.TextEncoder = require('util').TextEncoder;

// Fix issue where `import { cache } from 'react';` not found
jest.mock('react', () => ({
  ...jest.requireActual('react'), // This will keep the original functionalities of 'react'
  cache: jest.fn((fn) => fn), // return the original function
}));
