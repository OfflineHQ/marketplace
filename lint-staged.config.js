module.exports = {
  '{apps,libs,tools}/**/*.{js,ts,tsx,json,sql,gql,graphql}': (files) => {
    return `nx affected --target=typecheck --files=${files.join(',')}`;
  },
  '{apps,libs,tools,hasura}/**/*.{js,ts,jsx,tsx,json,sql,gql,graphql}': [
    (files) => `nx affected:lint --fix --parallel --files=${files.join(',')}`,
    (files) => `nx format:write --files=${files.join(',')}`,
  ],
};
