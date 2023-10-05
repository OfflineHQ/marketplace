const { getJestProjects } = require('@nx/jest');

module.exports = {
  projects: getJestProjects(),

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs'],
};
