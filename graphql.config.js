const userHeaders = {
  'x-hasura-role': 'user',
  'x-hasura-default-role': 'user',
  'x-hasura-admin-secret': 'password',
};

const adminHeaders = {
  'x-hasura-role': 'admin',
  'x-hasura-default-role': 'admin',
  'x-hasura-admin-secret': 'password',
};

const gqlPath = 'libs/next/gql';

module.exports = {
  projects: {
    admin: {
      schema: `${gqlPath}/admin/src/generated/schema.json`,
      documents: `${gqlPath}/admin/src/queries/**/*.gql`,
      extensions: {
        endpoints: {
          default: {
            url: 'http://localhost:8080/v1/graphql',
            headers: adminHeaders,
          },
        },
      },
    },
    user: {
      schema: `${gqlPath}/user/src/generated/schema.json`,
      documents: `${gqlPath}/user/src/queries/**/*.gql`,
      extensions: {
        endpoints: {
          default: {
            url: 'http://localhost:8080/v1/graphql',
            headers: userHeaders,
          },
        },
      },
    },
  },
};
