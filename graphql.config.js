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

const gqlPath = 'libs/gql';

module.exports = {
  projects: {
    admin: {
      schema: `${gqlPath}/admin/api/src/generated/schema.json`,
      documents: `${gqlPath}/admin/api/src/queries/**/*.gql`,
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
      schema: `${gqlPath}/user/api/src/generated/schema.json`,
      documents: `${gqlPath}/user/api/src/queries/**/*.gql`,
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
