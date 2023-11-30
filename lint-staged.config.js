module.exports = {
  '{apps,libs,tools}/**/*.{js,ts,tsx,json,sql,gql,graphql}': (files) => {
    const fileList = files.join(',');
    return [
      `pnpm nx format:write --files=${fileList}`,
      `pnpm nx affected:lint --fix --parallel=6 --eslintConfig=.eslintrc.ci.json --files=${fileList}`,
    ];
  },
};
