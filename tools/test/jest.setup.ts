/* eslint-disable @typescript-eslint/no-var-requires */
const nodeFetch = require('node-fetch');
const http = require('http');
const https = require('https');

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './tools/test/.env.test.jest' });
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
  cache: jest.fn(() => {
    /* mock implementation */
  }),
}));
