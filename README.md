<p align="center"><img width="22%" alt="offline logo" src="https://github.com/user-attachments/assets/35c58da8-89ee-41c4-af27-884b86ee4834"></p>

> **Offline: Next-gen Consumer Brand Interaction Platform**

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Quick Install](#quick-install)
4. [Project Structure](#project-structure)
5. [The Stack](#the-stack)
6. [Libraries](#libraries)
7. [Tests](#tests)
8. [NX Workspace](#nx-workspace)
9. [Environment Configuration](#environment-configuration)
10. [Troubleshoot](#troubleshoot)
11. [Services](#services)

## Project Overview

Offline is an innovative platform designed to revolutionize brand-customer interactions through user-centric applications leveraging blockchain and NFT technologies. The project consists of three main applications:

1. **Marketplace** (`apps/web`): The user-facing app where customers can browse and purchase tickets for events offered by organizers. This serves as the main entry point for consumers to interact with brands and access exclusive experiences.

2. **Back-office** (`apps/back-office`): A comprehensive management interface for organizers to create and manage their events, smart contracts, and analyze performance metrics. This empowers brands to easily create and manage their offerings on the Offline platform.

3. **Unlock** (`apps/unlock`): An iframe app that allows users to connect their Offline smart contract wallet across various platforms outside of Offline. This includes integration with Shopify stores for token-gating campaigns, expanding the utility of Offline's blockchain-based assets.

## Architecture

The Offline Marketplace Monorepo employs a microservices architecture with the following key components:

- **Hasura**: Serves as the central data layer, providing a GraphQL API for all three Next.js applications. This ensures consistent data access and management across the platform.

- **Next.js Apps**:

  1. Marketplace (`apps/web`)
  2. Back-office (`apps/back-office`)
  3. Unlock (`apps/unlock`)

  Each app is built using Next.js 14 with the App Router, ensuring optimal performance and SEO capabilities.

- **Blockchain Integration**: Utilizes smart contracts for ticket management and token-gating functionality. This provides a secure and transparent way to manage digital assets and access rights.

- **External Integrations**: Includes a Shopify app (separate project: shopify-gates) for creating token-gating campaigns on merchant stores, powered by OF Keys and OF Stamps. This extends the reach of Offline's technology to e-commerce platforms.

## Quick Install

1. First you need to install pnpm in your machine `npm install -g pnpm`
2. Install all the dependencies `pnpm install`
3. Provide the needed API keys in the `.env.local` file

   **[Refer to this section to set your .env.local with the needed API keys](#env-mandatory)**

4. Then you can run the project `pnpm start`

## Project Structure

### Access to the services and app URLs locally

- [**Hasura console**](http://localhost:9695/console)

The console is used as a backoffice to handle the graphQL server and to innerlink all the microservices.

- [**Web**](http://localhost:8888)

This is the main web app where you can browse and purchase tickets for events. It also serve as an API provider for external integrations like our Shopify tokengating app.

- [**Back-office**](http://localhost:1789)

This is the back-office app where organizers can manage their events, smart contracts and analyze the performance metrics.

- [**Unlock**](http://localhost:8889)

This is the iframe app where the users connect their smart wallet to our platform seamlessly across domains. It is embedded in the Shopify stores for tokengating campaigns.

# The Stack

## Docker

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/198038805-76a9dc37-538e-41f5-93c5-0e372d43ae9a.png" width="22%"></p>

This repo is configured to be built with Docker, and Docker compose.

To build all apps in this repo:

```shell
pnpm docker:build
```

To shutdown all running containers:

```shell
pnpm docker:stop
```

To launch all the services containers:

```shell
pnpm docker:services
```

The command to run all the services in this repo is

```shell
pnpm docker:services
```

The command to run all the containers for unit and integration test is

```shell
pnpm docker:test
```

## Storybook

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/198039106-fa335322-4416-4f3f-967c-f6c663963ab2.png" width="55%"></p>

We have four separate Storybooks for different parts of our project:

1. **UI Components**: Individual stories for each component (mostly based on shadcn/ui).
   [View UI Storybook](https://staging--6408af6e1ba96e06e062bbb1.chromatic.com)

2. **Web Platform**: Exposes the Offline platform user-facing app.
   [View Web Storybook](https://staging--63fe151cbff444bb85293d09.chromatic.com)

3. **Back Office**: Exposes the Offline platform organizer app.
   [View Back Office Storybook](https://staging--654288a25cf4cf069953529c.chromatic.com)

4. **Unlock**: Exposes the Offline iframe app.
   [View Unlock Storybook](https://staging--65d8bdc005f02c93ab8be52f.chromatic.com)

We use [interaction testing](https://storybook.js.org/docs/react/writing-tests/interaction-testing) with the Storybook version of Jest and Testing Library to provide dynamic demonstrations of individual components along with testing.

Additionally, we use [Chromatic](https://www.chromatic.com) in our CI pipeline to spot and approve/decline UI changes across all our Storybooks.

## Utilities

This repo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Husky](https://github.com/typicode/husky) Git hook library used to execute ESLint and Prettier on staged files before a commit.
- [Playwright](https://playwright.dev) test runner for E2E and components test
- [Graphql Code Generator](https://www.the-guild.dev/graphql/codegen/) a generator for the graphql schemas and a client builders with provided queries.

## Libraries

### Next Auth & Cometh Connect

<p align="center" style="display: flex; align-items: center; justify-content: center; gap: 100px;">
  <img src="https://user-images.githubusercontent.com/11297176/196224807-718c7649-b946-423e-9449-92ef244a6816.png" width="10%">
  <img src="https://github.com/user-attachments/assets/a043873a-ddc1-4e02-8a42-8321118fc288" width="30%">
</p>

This project uses [Next-Auth](https://next-auth.js.org) in conjunction with [Cometh Connect](https://docs.cometh.io/connect) to provide secure authentication for users.

Our authentication method utilizes smart wallet signatures, offering a seamless and secure connection through the verification of a signature on a smart contract. This approach leverages blockchain technology to provide a robust and user-friendly authentication experience.

The authentication providers and configuration can be found in `libs/next/next-auth/options`.

We associate the smart account with a Hasura account by persisting the wallet address and a UUID in our database.

For more details on the signature verification process, refer to the [Cometh Connect documentation](https://docs.cometh.io/connect/features/sign-verify-a-message).

### GraphQL code generator

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/196225336-16072309-c798-4263-85ed-b5332509dc99.jpeg" width="18%"></p>

The command `pnpm graphql-codegen` will launch the `graphql-codegen` script. All the codegen definitions are written in the file `codegen.ts`. You should run this command each time you modify a graphql query or update something on the hasura console to have the updated generated sdk and utilities functions.

The generator is divided in three parts, corresponding to the role of `anonymous`, `user` and `admin`, targeting the graphql hasura server for those respective roles.

Each one have a graphql schema and an ast schema generated and specfic sdk.

**Anonymous**

The graphql queries definition are defined in `libs/gql/anonymous/api/queries`. We use a generic sdk with a simple fetch query in order to facilitate the querying the data for the anonymous role. Those queries doesn't need any authentication and thus are limited to read only access on some basic information about the events.

**User**

The graphql queries definition are defined in `libs/gql/user/api/queries`. We use the React-Query module in order to facilitate the querying the data for the user role in the fontend client. The hasura service will read the auth cookie in order to validate the request. We also generate a generic sdk in order to facilitate testing of user query with jest on `libs/test-utils/gql/src/generated/test-account.ts`where we provide a Bearer JWT instead of a cookie because jest is not capable to provide one.

**Admin**

The graphql queries definition are defined in `libs/gql/admin/api/queries`. We use a generic sdk with a simple fetch query in order to facilitate the querying the data for the admin role. Those queries are made on the server side of the frontend. Hasura will allow the request through the providing of the `X-Hasura-Admin-Secret`.

### shadcn/ui

<p align="center"><img src="https://ui.shadcn.com/og.jpg" width="50%"></p>

We use [shadcn/ui](https://ui.shadcn.com/) as our component library. It provides a set of re-usable components that you can copy and paste into your apps.

Key features of shadcn/ui in our project:

- **Customizable**: The components are built using Radix UI and Tailwind CSS, allowing for easy customization to match our design system.
- **Accessible**: Built on top of Radix UI primitives, ensuring accessibility out of the box.
- **Themeable**: Supports light and dark mode, with the ability to extend for custom themes.

Our custom implementations and extensions of shadcn/ui components can be found in the `libs/ui/components` directory. We've adapted these components to fit our specific needs while maintaining the core benefits of the library.

For more information on how we use and customize shadcn/ui, refer to our UI Components Storybook.

## Tests

### Jest

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/196227843-0616474f-f801-49ad-bf87-b0f27baac0f2.png" width="20%"></p>

Jest is the test runner used for unit and integration tests. To run all the Jest tests on affected code, you can use the command:

```shell
pnpm affected:test
```

The global settings for Jest are located in tools/test. This directory contains a docker-compose file and an env file to launch specific services used for the integration tests:

- `test-db`: a database for testing running in memory to speed up execution.
- `hasura-engine`: used to interact with the test-db and services, it uses all the metadata and migrations from the one we used in dev.
- `jest.preset.js` and `jest.setup.ts` are referencing all the needed setup to launch the tests. It checks that the hasura-console is running and is healthy.

Coverage for all the libraries is created in the root of the workspace. In order to maintain code quality, you can uncomment this section with the minimum coverage before the test reports a failure on CI:Coverage for all the libs is created in the root of the workspace. In order to maintain code quality, you can uncommit this section with the minimum coverage before the test report a failure on CI:

```js
{
  // global: {
  // branches: 80,
  // functions: 80,
  // lines: 80,
  // statements: 80,
  // },
}
```

### Playwright

<p align="center">
  <img src="https://github.com/user-attachments/assets/e0f5089b-905b-4e18-9181-a09bcd7d2a83" width="40%">
</p>

Playwright is the test runner used for e2e tests. The tests for the web app are located in `apps/web/e2e` and `apps/back-office/e2e`.

Before running the tests, be sure that all the service containers are running with:

```shell
pnpm docker:services
```

The test command will wait for all the necessary services to be reachable before launching Playwright.

To run all the Playwright tests on affected code, you can use the command:

```shell
pnpm affected:e2e
```

## NX Workspace

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="20%"></p>

🔎 **Smart, Fast and Extensible Build System**

### Categories of libraries

In a workspace, libraries are typically divided into four different types:

#### Feature

Libraries that implement "smart" UI (e.g. is effectful, is connected to data sources, handles routing, etc.) for specific business use cases.

#### UI

Libraries that contain only presentational components. That is, compo- nents that render purely from their props, and calls function handlers when interaction occurs.

#### Data-access

Libraries that contain the means for interacting with external data services; external services are typically backend services.

#### Utility

Libraries that contain common utilities that are shared by many projects.

## Environment Configuration

### Configure the project with your own `.env.local` API keys (mandatory)

<a name="env-mandatory" />

**In order to run the project, you need to configure the following environment variables in you `.env.local` file:**

### Alchemy env

Our platform uses [Alchemy](https://alchemy.com/?r=ba8fc42476de40ad) as an RPC provider for the Polygon blockchain. You need to create an account and [get an API key on the alchemy dashboard](https://dashboard.alchemyapi.io/?r=ba8fc42476de40ad):

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=
ALCHEMY_API_KEY=
ALCHEMY_AUTH_TOKEN=
# Warning ! Those api keys are going to get leaked in the client side code so it's advised to set ALLOWLIST DOMAIN in the alchemy dashboard to your apex domain (in our case www.offline.live) in order to avoid someone hijacking your api keys.
```

### JWT secret keys

In order to secure your JWT authentication provided by [Next Auth](https://next-auth.js.org/) you are going to need to generate your own RSA-256 keys.

### Configure Hasura and Next Auth with same RSA key

You need to configure hasura and next auth to have the same asymmetric key. One is provided by default but you can generate your own RSA 256 key using those commands:

```shell
# Don't add passphrase

ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwtRS256.key

ssh-keygen -e -m PEM -f jwtRS256.key > jwtRS256.key.pub
```

<https://hasura.io/blog/next-js-jwt-authentication-with-next-auth-and-integration-with-hasura/>

- Copy the public key in a single line format:

```shell
awk -v ORS='\\n' '1' jwtRS256.key.pub | pbcopy
```

- Now paste this value in your clipboard to `HASURA_GRAPHQL_JWT_SECRET` env in the format

```shell
{ "type": "RS256", "key": "<insert-your-public-key-here>"}
```

- Copy private key and paste it into `NEXTAUTH_SECRET` env

```shell
cat jwtRS256.key | pbcopy
```

Don't forget to add double quotes "" arround so that `\n` are interpreted correctly

## Troubleshoot

In case you need your own image instead of `sebpalluel/hasura_cli_with_socat_and_curl` you can do the following command to publish it in docker hub.

Be sure to have activated the buildx module first by following [this article](https://cloudolife.com/2022/03/05/Infrastructure-as-Code-IaC/Container/Docker/Docker-buildx-support-multiple-architectures-images/)

```shell
cd hasura && docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t <username>/<image>:latest --push .
```

## Services

Our project leverages various services to provide a robust and feature-rich platform. Here's an overview of the key services we use:

### Cometh Connect

<p align="center">
  <img src="https://github.com/user-attachments/assets/a043873a-ddc1-4e02-8a42-8321118fc288" width="25%">
</p>

Cometh Connect is our Smart Wallet infrastructure provider, enabling seamless and user-friendly blockchain interactions for our users.

### Alchemy

<p align="center">
  <img src="https://github.com/user-attachments/assets/29f5c3ad-66a8-4def-8f6b-2abe1bfa36e7" width="25%">
</p>

Alchemy provides robust blockchain infrastructure. We use it as an RPC provider for Ethereum, Polygon, and Arbitrum blockchains, enabling seamless interaction with these networks.

### Thirdweb

<p align="center">
<img width="25%" alt="thirdweb-logo" src="https://github.com/user-attachments/assets/2a613c3a-da68-4087-b5ce-89adcba4bdc6">
</p>

Thirdweb is integrated for deploying and managing our NFT smart contracts. It's crucial for our event passes and token gating features, simplifying the process of creating and managing blockchain-based assets.

### Vercel

<p align="center">
  <img src="https://github.com/user-attachments/assets/cd7e068b-76a8-4ad3-a1b5-af4ef17964b7" width="25%">
</p>

Vercel is our cloud platform of choice for hosting our web apps and api. It provides a robust and scalable environment for our applications.

### Openzeppelin

<p align="center">
  <img src="https://github.com/user-attachments/assets/69277928-f564-4eb7-819a-dfba54fad06f" width="25%">
</p>

Openzeppelin relayer is used to manage our meta transactions and allow gasless transactions on our deployed smart contracts.

### Hasura

<p align="center"><img src="https://hasura.io/brand-assets/hasura-logo-primary-dark.svg" width="25%"></p>

Hasura serves as our GraphQL API gateway, providing a unified interface to our Postgres database and other microservices. It handles authentication and authorization through a Next-Auth adapter.

### Neon DB

<p align="center">
<img width="25%" alt="neon-logo" src="https://github.com/user-attachments/assets/89f9f0c0-a5f1-4bd5-a1aa-39530ffae0bf">
</p>

Neon is our Postgres database provider. It provides a scalable and secure database solution for our applications.

### Hygraph (CMS)

<p align="center">
<img width="25%" alt="hygraph-logo" src="https://github.com/user-attachments/assets/84a41fff-fc1c-4705-a132-05aac6a8a201">
</p>

Hygraph is our headless CMS, used for managing event content. It provides a flexible and powerful system for creating and organizing event information across our platform.

In order to use Hygraph you can simply clone our project there and use it as your own CMS.

[![Clone Project](https://hygraph.com/button)](https://app.hygraph.com/clone/87d4b94f102e4491b3e77e4aae06fdd9?name=Offline%20marketplace)

### Bytescale

<p align="center">
<img width="18%" alt="bytescale-logo" src="https://github.com/user-attachments/assets/a53c6305-821e-4354-9e08-db60a9260bb9">
</p>

Bytescale is used to secure event passes and allow users to access them through NFT holdings. It provides robust file management and access control for our digital assets.

### Sumsub

<p align="center">
  <img src="https://github.com/user-attachments/assets/a814a5e9-8d10-48af-bd82-6fd03b44bd7f" width="35%">
</p>

Sumsub provides KYC (Know Your Customer) and AML (Anti-Money Laundering) solutions, helping us maintain regulatory compliance in user onboarding processes.

### Stripe

<p align="center">
  <img src="https://github.com/user-attachments/assets/27784fab-7d00-45b7-a753-c78af98743e4" width="25%">
</p>

Stripe is our payment processing platform, handling secure transactions and financial operations within the application.

### Posthog

<p align="center">
  <img src="https://github.com/user-attachments/assets/31ab2c8a-babc-4fd4-936a-50479dda7858" width="35%">
</p>

Posthog is our analytics platform, helping us track user behavior and gather insights to improve the application.

### Sentry

<p align="center">
  <img src="https://github.com/user-attachments/assets/333016de-3f9b-49a0-a720-709748a5cc68" width="30%">
</p>

Sentry is our error tracking platform.
