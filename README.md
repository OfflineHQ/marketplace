<p align="center"><img width="50%" alt="offline logo" src="https://github.com/user-attachments/assets/35c58da8-89ee-41c4-af27-884b86ee4834"></p>

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

<p align="center"><img src="path_to_architecture_diagram.png" width="80%"></p>
<p align="center"><em>Offline Platform Architecture</em></p>

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

<p align="center"><img src="path_to_integration_diagram.png" width="70%"></p>
<p align="center"><em>Offline External Integrations</em></p>

## Quick Install

1. First you need to install pnpm in your machine `npm install -g pnpm`
2. Install all the dependencies `pnpm install`
3. Create a .env

   **[Refer to this section to set your .env with the needed API keys](#env-mandatory)**

4. Then you can run the project `pnpm start`

5. Make sure to apply the migrations to the prisma db and client once the container is running `pnpm prisma-db:dev:start`

## Project Structure

**View in [NX Graph](https://sebpalluel.github.io/offline/?groupByFolder=true&select=all)**

[![name](https://user-images.githubusercontent.com/11297176/207392383-8f817b50-d646-4586-870e-d6bf53481577.png)](https://sebpalluel.github.io/offline/?groupByFolder=true&select=all)

### Access to the services and app URLs locally

- [**Hasura console**](http://localhost:9695/console)

The console is used as a backoffice to handle the graphQL server and to innerlink all the microservices.

- [**React Next app**](http://localhost:8888/en/)

This is the main web app client used to access the whole array of services.

- [**Mailhog**](http://localhost:8025/)

This is the mail-catcher where all the mail are going in dev environment.

# The Stack

## Docker

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/198038805-76a9dc37-538e-41f5-93c5-0e372d43ae9a.png" width="15%"></p>

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

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/198039106-fa335322-4416-4f3f-967c-f6c663963ab2.png" width="35%"></p>

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

<p align="center">
  <img src="https://user-images.githubusercontent.com/11297176/196224807-718c7649-b946-423e-9449-92ef244a6816.png" width="10%">
  ![logo-cometh](https://github.com/user-attachments/assets/a043873a-ddc1-4e02-8a42-8321118fc288)

</p>

This project uses [Next-Auth](https://next-auth.js.org) in conjunction with [Cometh Connect](https://docs.cometh.io/connect) to provide secure authentication for users.

Our authentication method utilizes smart wallet signatures, offering a seamless and secure connection through the verification of a signature on a smart contract. This approach leverages blockchain technology to provide a robust and user-friendly authentication experience.

The authentication providers and configuration can be found in `libs/next/next-auth/options`.

We associate the smart account with a Hasura account by persisting the wallet address and a UUID in our database.

For more details on the signature verification process, refer to the [Cometh Connect documentation](https://docs.cometh.io/connect/features/sign-verify-a-message).

### GraphQL code generator

<p align="center"><img src="https://user-images.githubusercontent.com/11297176/196225336-16072309-c798-4263-85ed-b5332509dc99.jpeg" width="15%"></p>

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

<p align="center"><img src="https://ui.shadcn.com/og.jpg" width="200"></p>

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
  <img src="https://user-images.githubusercontent.com/11297176/196226285-40932c18-00e4-4bf4-b8cf-b2af9cda6d0e.png" width="40%">
  ![plawwright-logo](https://github.com/user-attachments/assets/a1df407e-65f2-4673-a7b2-4258283ff46c)
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

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="15%"></p>

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

### Alchemy

The Nestjs and Nextjs Apps uses [Alchemy](https://alchemy.com/?r=ba8fc42476de40ad) as an RPC provider for the Ethereum, Polygon and Arbitrum blockchains. You need to create an account and [get an API key for those on the alchemy dashboard](https://dashboard.alchemyapi.io/?r=ba8fc42476de40ad):

```bash
ALCHEMY_ETHEREUM_MAINNET_TOKEN=
ALCHEMY_POLYGON_MAINNET_TOKEN=
ALCHEMY_ARBITRUM_MAINNET_TOKEN=
# Warning ! Those api keys are going to get leaked in the client side code so it's advised to set ALLOWLIST DOMAIN in the alchemy dashboard to your apex domain (in our case www.offline.app) in order to avoid someone hijacking your api keys. By default a public rpc network is used for the client side code so you don't need to set those api keys if you don't want to.
# NEXT_APP_ALCHEMY_ETHEREUM_MAINNET_TOKEN=
# NEXT_APP_ALCHEMY_POLYGON_MAINNET_TOKEN=
# NEXT_APP_ALCHEMY_ARBITRUM_MAINNET_TOKEN=
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

<p align="center"><img src="https://docs.cometh.io/connect/assets/logo.svg" width="200"></p>

Cometh Connect is our Smart Wallet infrastructure provider, enabling seamless and user-friendly blockchain interactions for our users.

### Alchemy

<p align="center">
  <img src="https://www.alchemy.com/images/logo.svg" width="200">
  ![alchemy-logo](https://github.com/user-attachments/assets/29f5c3ad-66a8-4def-8f6b-2abe1bfa36e7)<svg width="822" height="175" viewBox="0 0 822 175" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M257.433 93.1133V91.0622C257.433 85.9082 255.67 81.9637 252.146 79.2289C248.728 76.3889 244.242 74.9689 238.688 74.9689C234.416 74.9689 231.051 75.7052 228.595 77.1778C226.245 78.5452 224.002 80.6489 221.866 83.4889C221.225 84.3304 220.531 84.9089 219.783 85.2244C219.036 85.54 218.021 85.6978 216.739 85.6978H211.933C210.758 85.6978 209.69 85.277 208.729 84.4356C207.874 83.5941 207.501 82.5948 207.607 81.4378C207.928 78.2822 209.476 75.1793 212.253 72.1289C215.137 68.9733 218.929 66.3963 223.628 64.3978C228.328 62.3993 233.348 61.4 238.688 61.4C248.621 61.4 256.631 64.1348 262.719 69.6045C268.914 75.0741 272.012 82.7526 272.012 92.64V140.762C272.012 141.919 271.584 142.919 270.73 143.76C269.875 144.601 268.861 145.022 267.686 145.022H261.758C260.583 145.022 259.569 144.601 258.714 143.76C257.86 142.919 257.433 141.919 257.433 140.762V134.293C255.724 138.08 252.092 141.078 246.538 143.287C240.984 145.496 235.43 146.6 229.876 146.6C224.429 146.6 219.57 145.653 215.297 143.76C211.025 141.761 207.714 139.079 205.364 135.713C203.121 132.347 202 128.561 202 124.353C202 116.464 204.991 110.311 210.972 105.893C216.953 101.37 224.91 98.32 234.843 96.7422L257.433 93.1133ZM257.433 105.736L238.528 108.733C231.585 109.785 226.192 111.521 222.347 113.94C218.502 116.254 216.579 119.199 216.579 122.776C216.579 125.405 217.807 127.772 220.264 129.876C222.72 131.979 226.459 133.031 231.479 133.031C239.169 133.031 245.417 130.875 250.223 126.562C255.029 122.25 257.433 116.622 257.433 109.68V105.736Z" fill="#0C0C0E"/>
<path d="M309.965 140.762C309.965 141.919 309.538 142.919 308.683 143.76C307.829 144.601 306.814 145.022 305.639 145.022H299.712C298.537 145.022 297.522 144.601 296.668 143.76C295.813 142.919 295.386 141.919 295.386 140.762V37.26C295.386 36.103 295.813 35.1037 296.668 34.2622C297.522 33.4207 298.537 33 299.712 33H305.639C306.814 33 307.829 33.4207 308.683 34.2622C309.538 35.1037 309.965 36.103 309.965 37.26V140.762Z" fill="#0C0C0E"/>
<path d="M367.674 133.031C378.355 133.031 385.564 128.929 389.303 120.724C390.05 119.147 390.798 118.042 391.546 117.411C392.293 116.78 393.308 116.464 394.59 116.464H399.396C400.571 116.464 401.585 116.885 402.44 117.727C403.294 118.463 403.721 119.357 403.721 120.409C403.721 123.985 402.28 127.824 399.396 131.927C396.512 136.029 392.347 139.5 386.899 142.34C381.452 145.18 375.044 146.6 367.674 146.6C360.091 146.6 353.522 145.022 347.969 141.867C342.415 138.711 338.142 134.399 335.152 128.929C332.161 123.354 330.506 117.148 330.185 110.311C330.078 109.049 330.025 106.63 330.025 103.053C330.025 100.529 330.078 98.7407 330.185 97.6889C331.147 86.96 334.831 78.2296 341.24 71.4978C347.648 64.7659 356.46 61.4 367.674 61.4C375.044 61.4 381.399 62.82 386.739 65.66C392.186 68.3948 396.298 71.8133 399.075 75.9156C401.959 79.9126 403.508 83.6993 403.721 87.2756C403.828 88.4326 403.401 89.4319 402.44 90.2733C401.585 91.1148 400.571 91.5356 399.396 91.5356H394.59C393.308 91.5356 392.293 91.22 391.546 90.5889C390.798 89.9578 390.05 88.8533 389.303 87.2756C385.564 79.0711 378.355 74.9689 367.674 74.9689C361.8 74.9689 356.673 76.9148 352.294 80.8067C347.915 84.6985 345.405 90.5889 344.764 98.4778C344.658 99.6348 344.604 101.528 344.604 104.158C344.604 106.577 344.658 108.365 344.764 109.522C345.512 117.411 348.022 123.301 352.294 127.193C356.673 131.085 361.8 133.031 367.674 133.031Z" fill="#0C0C0E"/>
<path d="M496.913 140.762C496.913 141.919 496.486 142.919 495.632 143.76C494.777 144.601 493.763 145.022 492.588 145.022H486.66C485.485 145.022 484.47 144.601 483.616 143.76C482.762 142.919 482.334 141.919 482.334 140.762V99.1089C482.334 91.22 480.358 85.2245 476.407 81.1222C472.455 77.02 466.954 74.9689 459.905 74.9689C452.963 74.9689 447.462 77.02 443.403 81.1222C439.452 85.2245 437.476 91.22 437.476 99.1089V140.762C437.476 141.919 437.048 142.919 436.194 143.76C435.34 144.601 434.325 145.022 433.15 145.022H427.222C426.047 145.022 425.033 144.601 424.178 143.76C423.324 142.919 422.897 141.919 422.897 140.762V37.26C422.897 36.103 423.324 35.1037 424.178 34.2622C425.033 33.4207 426.047 33 427.222 33H433.15C434.325 33 435.34 33.4207 436.194 34.2622C437.048 35.1037 437.476 36.103 437.476 37.26V72.1289C439.825 69.0785 443.03 66.5541 447.088 64.5555C451.254 62.4518 456.327 61.4 462.308 61.4C469.037 61.4 475.018 62.82 480.252 65.66C485.485 68.5 489.544 72.6022 492.428 77.9667C495.418 83.2259 496.913 89.4845 496.913 96.7422V140.762Z" fill="#0C0C0E"/>
<path d="M553.054 61.4C564.483 61.4 573.508 64.9763 580.13 72.1289C586.752 79.2815 590.063 89.0111 590.063 101.318V105.578C590.063 106.735 589.636 107.734 588.781 108.576C587.927 109.417 586.912 109.838 585.737 109.838H530.625V110.784C530.839 117.727 532.975 123.196 537.033 127.193C541.199 131.085 546.539 133.031 553.054 133.031C558.395 133.031 562.507 132.347 565.391 130.98C568.381 129.613 571.051 127.667 573.401 125.142C574.255 124.301 575.003 123.722 575.644 123.407C576.392 123.091 577.353 122.933 578.528 122.933H583.334C584.616 122.933 585.684 123.354 586.538 124.196C587.393 125.037 587.766 126.036 587.66 127.193C587.232 130.033 585.63 132.979 582.853 136.029C580.183 138.974 576.285 141.499 571.158 143.602C566.138 145.601 560.104 146.6 553.054 146.6C546.219 146.6 540.131 145.075 534.79 142.024C529.45 138.869 525.178 134.556 521.974 129.087C518.876 123.617 517.007 117.464 516.366 110.627C516.153 107.471 516.046 105.052 516.046 103.369C516.046 101.686 516.153 99.2667 516.366 96.1111C517.007 89.5896 518.876 83.6993 521.974 78.44C525.178 73.1807 529.397 69.0259 534.63 65.9756C539.971 62.9252 546.112 61.4 553.054 61.4ZM575.644 96.5845V96.1111C575.644 89.6948 573.561 84.5933 569.396 80.8067C565.337 76.9148 559.89 74.9689 553.054 74.9689C546.86 74.9689 541.573 76.9148 537.194 80.8067C532.921 84.6985 530.732 89.8 530.625 96.1111V96.5845H575.644Z" fill="#0C0C0E"/>
<path d="M623.97 72.1289C626.533 68.8682 629.417 66.2911 632.621 64.3978C635.825 62.3993 640.097 61.4 645.438 61.4C657.934 61.4 666.692 65.9756 671.712 75.1267C674.81 70.7089 678.334 67.343 682.286 65.0289C686.238 62.6096 691.418 61.4 697.826 61.4C708.293 61.4 716.037 64.503 721.057 70.7089C726.183 76.9148 728.747 85.6978 728.747 97.0578V140.762C728.747 141.919 728.32 142.919 727.465 143.76C726.611 144.601 725.596 145.022 724.421 145.022H718.493C717.318 145.022 716.304 144.601 715.449 143.76C714.595 142.919 714.168 141.919 714.168 140.762V98.6356C714.168 82.8578 707.866 74.9689 695.263 74.9689C689.495 74.9689 684.903 76.8622 681.485 80.6489C678.067 84.4356 676.358 90.063 676.358 97.5311V140.762C676.358 141.919 675.931 142.919 675.077 143.76C674.222 144.601 673.207 145.022 672.033 145.022H666.105C664.93 145.022 663.915 144.601 663.061 143.76C662.206 142.919 661.779 141.919 661.779 140.762V98.6356C661.779 82.8578 655.478 74.9689 642.874 74.9689C637.107 74.9689 632.514 76.8622 629.096 80.6489C625.679 84.4356 623.97 90.063 623.97 97.5311V140.762C623.97 141.919 623.542 142.919 622.688 143.76C621.833 144.601 620.819 145.022 619.644 145.022H613.716C612.541 145.022 611.527 144.601 610.672 143.76C609.818 142.919 609.391 141.919 609.391 140.762V67.2378C609.391 66.0807 609.818 65.0815 610.672 64.24C611.527 63.3985 612.541 62.9778 613.716 62.9778H619.644C620.819 62.9778 621.833 63.3985 622.688 64.24C623.542 65.0815 623.97 66.0807 623.97 67.2378V72.1289Z" fill="#0C0C0E"/>
<path d="M773.617 171.213C772.656 173.738 771.107 175 768.971 175H762.402C761.334 175 760.426 174.632 759.679 173.896C758.931 173.159 758.557 172.265 758.557 171.213C758.557 170.793 758.61 170.424 758.717 170.109L774.097 137.133L742.376 67.8689C742.269 67.5533 742.216 67.1852 742.216 66.7645C742.216 65.7126 742.589 64.8185 743.337 64.0822C744.085 63.3459 744.993 62.9778 746.061 62.9778H752.629C754.765 62.9778 756.314 64.24 757.275 66.7645L781.948 120.409L806.94 66.7645C807.902 64.24 809.45 62.9778 811.586 62.9778H818.155C819.223 62.9778 820.131 63.3459 820.878 64.0822C821.626 64.8185 822 65.7126 822 66.7645C822 67.1852 821.947 67.5533 821.84 67.8689L773.617 171.213Z" fill="#0C0C0E"/>
<path d="M141.427 92.8265L87.6313 1.49484C87.3709 1.04386 86.9936 0.668194 86.5377 0.405752C86.0818 0.143309 85.5633 0.00337153 85.0347 6.01651e-05C84.506 -0.0032512 83.9858 0.13018 83.5266 0.38689C83.0673 0.6436 82.6854 1.01451 82.4191 1.46219L66.3079 28.8291C65.7803 29.7249 65.5025 30.7411 65.5025 31.7755C65.5025 32.8099 65.7803 33.8261 66.3079 34.7219L101.386 94.3039C101.914 95.2006 102.674 95.945 103.589 96.4623C104.504 96.9796 105.542 97.2513 106.598 97.2503H138.821C139.348 97.2488 139.866 97.1115 140.322 96.8524C140.779 96.5932 141.158 96.2211 141.422 95.7733C141.686 95.3255 141.825 94.8177 141.826 94.3006C141.826 93.7835 141.689 93.2752 141.427 92.8265Z" fill="#0C0C0E"/>
<path d="M0.414818 140.56L54.2102 49.2282C54.4741 48.7808 54.8536 48.4093 55.3103 48.1511C55.767 47.8928 56.2849 47.7569 56.8121 47.7569C57.3393 47.7569 57.8574 47.8928 58.3141 48.1511C58.7708 48.4093 59.1501 48.7808 59.414 49.2282L75.5336 76.5706C76.0611 77.4679 76.3387 78.4854 76.3387 79.5211C76.3387 80.5568 76.0611 81.5743 75.5336 82.4716L40.4553 142.054C39.9292 142.95 39.171 143.695 38.2573 144.212C37.3436 144.729 36.3067 145.001 35.2515 145H3.02091C2.48997 145.003 1.96782 144.867 1.50753 144.608C1.04723 144.348 0.665279 143.974 0.400487 143.523C0.135695 143.072 -0.00249281 142.56 3.40419e-05 142.04C0.0025609 141.519 0.145658 141.009 0.414818 140.56Z" fill="#0C0C0E"/>
<path d="M59.4063 144.98H166.997C167.525 144.98 168.043 144.843 168.5 144.584C168.957 144.325 169.336 143.952 169.599 143.504C169.862 143.056 170.001 142.547 170 142.03C169.999 141.512 169.86 141.004 169.595 140.557L153.5 113.198C152.972 112.301 152.212 111.557 151.297 111.04C150.382 110.522 149.344 110.251 148.288 110.252H78.1319C77.0756 110.251 76.0378 110.522 75.1228 111.04C74.2078 111.557 73.4478 112.301 72.9197 113.198L56.8087 140.557C56.544 141.004 56.4043 141.512 56.4035 142.03C56.4028 142.547 56.5409 143.056 56.8042 143.504C57.0675 143.952 57.4467 144.325 57.9035 144.584C58.3603 144.843 58.8785 144.98 59.4063 144.98Z" fill="#0C0C0E"/>
</svg>


</p>

Alchemy provides robust blockchain infrastructure. We use it as an RPC provider for Ethereum, Polygon, and Arbitrum blockchains, enabling seamless interaction with these networks.

### Vercel

<p align="center">
  ![Vercel_logo_black svg](https://github.com/user-attachments/assets/cd7e068b-76a8-4ad3-a1b5-af4ef17964b7)
</p>

Vercel KV is used for key-value data storage, providing fast and scalable data access for certain application features.

### Hasura

<p align="center"><img src="https://hasura.io/brand-assets/hasura-logo-primary-dark.svg" width="200"></p>

Hasura serves as our GraphQL API gateway, providing a unified interface to our Postgres database and other microservices. It handles authentication and authorization through a Next-Auth adapter.

### Neon DB

<img width="1060" alt="neon-logo" src="https://github.com/user-attachments/assets/89f9f0c0-a5f1-4bd5-a1aa-39530ffae0bf">


### Hygraph (CMS)

![Hygraph_Logo](https://github.com/user-attachments/assets/84a41fff-fc1c-4705-a132-05aac6a8a201)

Hygraph is our headless CMS, used for managing event content. It provides a flexible and powerful system for creating and organizing event information across our platform.

In order to use Hygraph you can simply clone our project there and use it as your own CMS.

[![Clone Project](https://hygraph.com/button)](https://app.hygraph.com/clone/87d4b94f102e4491b3e77e4aae06fdd9?name=Offline%20marketplace)

### Bytescale

![bytescale-logo](https://github.com/user-attachments/assets/a53c6305-821e-4354-9e08-db60a9260bb9)

Bytescale is used to secure event passes and allow users to access them through NFT holdings. It provides robust file management and access control for our digital assets.

### Thirdweb

![thirdweb-logo](https://github.com/user-attachments/assets/2a613c3a-da68-4087-b5ce-89adcba4bdc6)

Thirdweb is integrated for deploying and managing our NFT smart contracts. It's crucial for our event passes and token gating features, simplifying the process of creating and managing blockchain-based assets.

### Cometh Connect

Cometh Connect is our Smart Wallet infrastructure provider, enabling seamless and user-friendly blockchain interactions for our users.

### Sumsub

<p align="center">
  <img src="https://sumsub.com/wp-content/uploads/2021/05/logo.svg" width="200">
  ![sumsub-logo](https://github.com/user-attachments/assets/a814a5e9-8d10-48af-bd82-6fd03b44bd7f)
</p>

Sumsub provides KYC (Know Your Customer) and AML (Anti-Money Laundering) solutions, helping us maintain regulatory compliance in user onboarding processes.

### Stripe

<p align="center">
  ![stripe_logo](https://github.com/user-attachments/assets/27784fab-7d00-45b7-a753-c78af98743e4)
</p>

Stripe is our payment processing platform, handling secure transactions and financial operations within the application.

### Posthog

<p align="center">
  ![posthog-logo](https://github.com/user-attachments/assets/31ab2c8a-babc-4fd4-936a-50479dda7858)
</p>

Posthog is our analytics platform, helping us track user behavior and gather insights to improve the application.
