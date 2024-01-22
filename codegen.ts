import { CodegenConfig } from '@graphql-codegen/cli';

const userSchema = {
  [`${
    process.env.NEXT_PUBLIC_HASURA_URL || 'http://localhost:8080/v1/graphql'
  }`]: {
    headers: {
      'x-hasura-admin-secret':
        process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'password',
      'x-hasura-default-role': 'user',
      'x-hasura-role': 'user',
    },
  },
};

const anonymousSchema = {
  [`${
    process.env.NEXT_PUBLIC_HASURA_URL || 'http://localhost:8080/v1/graphql'
  }`]: {
    headers: {
      'x-hasura-admin-secret':
        process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'password',
      'x-hasura-default-role': 'anonymous',
      'x-hasura-role': 'anonymous',
    },
  },
};

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'http://localhost:8080/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'password',
          'x-hasura-default-role': 'admin',
          'x-hasura-role': 'admin',
        },
      },
    },
  ],
  generates: {
    'libs/gql/shared/types/src/generated/index.ts': {
      plugins: [
        {
          typescript: {
            constEnums: true,
          },
        },
      ],
    },
    'libs/gql/admin/api/src/generated/schema.json': {
      plugins: ['introspection'],
    },
    'libs/gql/admin/api/src/generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
    'libs/gql/admin/types/src/generated/index.ts': {
      documents: './libs/gql/admin/api/src/queries/**/*.{graphql,gql}',
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/shared/types',
        importTypesNamespace: 'Types',
      },
      plugins: [
        {
          'typescript-operations': {
            preResolveTypes: true,
          },
        },
      ],
    },
    'libs/gql/admin/api/src/generated/index.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/admin/types',
        importTypesNamespace: 'Types',
      },
      documents: './libs/gql/admin/api/src/queries/**/*.{graphql,gql}',
      plugins: [
        {
          'typescript-generic-sdk': {
            noExport: true,
            documentMode: 'string',
          },
        },
        {
          add: {
            content: 'import { fetchData } from "@next/hasura/api";',
            placement: 'prepend',
          },
        },
        {
          add: {
            content: 'export const adminSdk = getSdk(fetchData({admin:true}));',
            placement: 'append',
          },
        },
      ],
    },
    // user
    'libs/gql/user/api/src/generated/schema.json': {
      schema: [userSchema],
      plugins: ['introspection'],
    },
    'libs/gql/user/api/src/generated/schema.graphql': {
      schema: [userSchema],
      plugins: ['schema-ast'],
    },
    'libs/gql/user/types/src/generated/index.ts': {
      documents: './libs/gql/user/api/src/queries/**/*.{graphql,gql}',
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/shared/types',
        importTypesNamespace: 'Types',
      },
      schema: [userSchema],
      plugins: [
        {
          'typescript-operations': {
            preResolveTypes: true,
          },
        },
      ],
    },
    'libs/gql/user/react-query/src/generated/index.tsx': {
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/user/types',
        importTypesNamespace: 'Types',
      },
      schema: [userSchema],
      documents: './libs/gql/user/api/src/queries/**/*.{graphql,gql}',
      plugins: [
        {
          'typescript-react-query': {
            fetcher: {
              func: '@next/hasura/react-query#fetchDataReactQuery',
              isReactHook: false,
            },
            errorType: 'Error',
            typesPrefix: 'Types.',
          },
        },
      ],
    },
    // anonymous
    'libs/gql/anonymous/api/src/generated/schema.json': {
      schema: [anonymousSchema],
      plugins: ['introspection'],
    },
    'libs/gql/anonymous/api/src/generated/schema.graphql': {
      schema: [anonymousSchema],
      plugins: ['schema-ast'],
    },
    'libs/gql/anonymous/types/src/generated/index.ts': {
      documents: './libs/gql/anonymous/api/src/queries/**/*.{graphql,gql}',
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/shared/types',
        importTypesNamespace: 'Types',
      },
      schema: [anonymousSchema],
      plugins: [
        {
          'typescript-operations': {
            preResolveTypes: true,
          },
        },
      ],
    },
    'libs/gql/anonymous/api/src/generated/index.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/anonymous/types',
        importTypesNamespace: 'Types',
      },
      documents: './libs/gql/anonymous/api/src/queries/**/*.{graphql,gql}',
      plugins: [
        {
          'typescript-generic-sdk': {
            noExport: true,
            documentMode: 'string',
          },
        },
        {
          add: {
            content: 'import { fetchData } from "@next/hasura/api";',
            placement: 'prepend',
          },
        },
        {
          add: {
            content: 'export const anonymousSdk = getSdk(fetchData());',
            placement: 'append',
          },
        },
      ],
    },
    'libs/gql/anonymous/react-query/src/generated/index.tsx': {
      preset: 'import-types',
      presetConfig: {
        typesPath: '@gql/anonymous/types',
        importTypesNamespace: 'Types',
      },
      schema: [anonymousSchema],
      documents: './libs/gql/anonymous/api/src/queries/**/*.{graphql,gql}',
      plugins: [
        {
          'typescript-react-query': {
            fetcher: {
              func: '@next/hasura/react-query#fetchDataReactQuery',
              isReactHook: false,
            },
            errorType: 'Error',
            typesPrefix: 'Types.',
          },
        },
      ],
    },
  },
};

//  ## hasura
//  #  doesn't support yet separated fragments so it fail
//  #  TODO: follow up on this issue https://github.com/dotansimha/graphql-code-generator/issues/7700
//  #  ref: https://www.graphql-code-generator.com/plugins/other/hasura-allow-list
//  hasura/app/metadata/allow_list.yaml:
//    documents: './libs/gql/*/api/src/queries/**/*.{graphql,gql}'
//    plugins:
//      - 'hasura-allow-list':
//        globalFragments: false
//    hooks:
//      afterOneFileWrite:
//        - make restart-hasura

export default config;
