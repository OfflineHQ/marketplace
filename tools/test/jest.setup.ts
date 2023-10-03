/* eslint-disable @typescript-eslint/no-var-requires */
const nodeFetch = require('node-fetch');
const http = require('http');
const https = require('https');

// Set the env variables to override:

process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'password';
process.env.POSTGRES_DB = 'postgres';
process.env.POSTGRES_PORT = '5454';

process.env.HASURA_GRAPHQL_DATABASE_URL =
  'postgres://postgres:password@test-db:5454/postgres';
process.env.HASURA_GRAPHQL_SERVER_PORT = '9696';
process.env.NEXTAUTH_URL = 'http://localhost:8888';
process.env.HASURA_GRAPHQL_ADMIN_SECRET = 'password';
process.env.HYGRAPH_CMS_WEBHOOK_READ_URL =
  '***REMOVED***';
process.env.HYGRAPH_CMS_READ_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2ODczNDQzODgsImF1ZCI6WyJodHRwczovL2FwaS1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vdjIvY2xpeWYxZnRlMDVyZjAxdW0yNTdvMmxpbS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiNWI1ZjUwMWMtYjQyOC00OGY1LWI2ZGEtOTcwMWZiZDlhZjViIiwianRpIjoiY2xqNWxhNnpwMDh5ZTAxdW0wcWsyN3A1byJ9.gMlU5X5OzMHiUPB_NlsOWogmh61uNn4mdsEm83cPOAcX4hkahhJqrgva2ODjfldC7C26RbWSdxTOJH3MNn_Dc6Vl38MweNtuVivkyHirC7S_ts9apoyfr_MGyfc0UxzvGyja06ljQ78F-NlizXpFGGZKPlPwTrq0_2wY_SlY6S1YRFDMqNbmYAiQTlzzrvB0ccd0Pnjp4dQ9-gygr4SA6lBfd44w9dN31JyvX2rzMyviFb1dEh9VxWGtgw-C41JP_Fkn30SSnFt1u2lmJt848d0vxT8mzwE6hg9uPSCzcALe3AjHP95_S2BqTSGw7a43iyfDVx3UhRMCbmPWntnX95v_Ht1XB7QDEarDavYlc8cFx5g1GRxGUrh2gfeJxGki2AQIToM3uaFtuq2hJ9R70_GX5k7DOK2_P8KgzCCXozMiHIGeCtJ6O5MGjA1U3AUOSw4F78u7AL9bid8g-v8zuAMEl7zBCcErqgKdcp28ehesDXEY0vBk9p5VfWpW_jNspD6G7hMg1gKCyYa2d4px-2Ftr3OpKnu9cSKQkKWWB_UvwNKZcZy1q0fI5hzz3wcLnsMiT_qHf8JBvXJ7wzOJBR2YTd1HsWv66NOVGESacUGRqUcsgR4ZjQHbWOxMcgsk3fe5oAKR3zDMR_CCWi3Q17s9_0z155GBGm-GPb0mjgE';

// # vercel/kv
process.env.KV_REST_API_URL = 'http://localhost:7070';
process.env.KV_REST_API_TOKEN = 'example_token_test';

// ## timezone
process.env.TZ = 'Europe/London';

//////////////

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
