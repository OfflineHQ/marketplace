const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: [`${process.cwd()}/tools/test/jest.setup.ts`],
  // collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],

  moduleNameMapper: {
    '@formkit/auto-animate/react': `${process.cwd()}/__mocks__/@formkit/auto-animate/react.js`,
    'auto-animate': `${process.cwd()}/__mocks__/auto-animate.tsx`,
  },
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
    '^.+\\.mjs$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'ecmascript' },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs'],
  coverageThreshold: {
    // global: {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
