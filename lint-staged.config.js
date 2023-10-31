module.exports = {
  '{apps,libs,tools}/**/*.{js,ts,tsx,json,sql,gql,graphql}': (files) => {
    const fileList = files.join(',');
    return [
      `nx affected --target=typecheck --files=${fileList}`,
      `nx affected:lint --fix --parallel --config=.eslintrc.ci.json --files=${fileList}`,
      `nx format:write --files=${fileList}`,
    ];
  },
};
