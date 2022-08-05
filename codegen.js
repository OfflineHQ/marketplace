const userHeaders = {
  'x-hasura-role': 'user',
  'x-hasura-default-role': 'user',
  'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'password',
};

const adminHeaders = {
  'x-hasura-role': 'admin',
  'x-hasura-default-role': 'admin',
  'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'password',
};

const pluginsAndConfig = {
  plugins: ['typescript', 'typescript-operations', 'typescript-react-query'],
  config: {
    preResolveTypes: true,
    constEnums: true,
    exposeQueryKeys: true,
    exposeFetcher: true,
  },
};

const hasuraSchema = (headers = userHeaders) => {
  let schema = {};
  schema[process.env.HASURA_URL] = { headers };
  return schema;
};

module.exports = {
  overwrite: true,
  watch: true,
  generates: {
    'libs/gql/user/src/generated/schema.json': {
      schema: [hasuraSchema()],
      plugins: ['introspection'],
    },
    'libs/gql/user/src/generated/schema.graphql': {
      schema: [hasuraSchema()],
      plugins: ['schema-ast'],
    },
    'libs/gql/user/src/generated/index.ts': {
      schema: [hasuraSchema()],
      documents: ['libs/gql/user/src/queries/**/*.{graphql,gql}'],
      ...pluginsAndConfig,
    },
    'libs/gql/admin/src/generated/schema.json': {
      schema: [hasuraSchema(adminHeaders)],
      plugins: ['introspection'],
    },
    'libs/gql/admin/src/generated/schema.graphql': {
      schema: [hasuraSchema(adminHeaders)],
      plugins: ['schema-ast'],
    },
    'libs/gql/admin/src/generated/index.ts': {
      schema: [hasuraSchema(adminHeaders)],
      documents: ['libs/gql/admin/src/queries/**/*.{graphql,gql}'],
      ...pluginsAndConfig,
    },
  },
};
