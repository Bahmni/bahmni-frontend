const { defaults } = require('jest-config');

module.exports = {
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
    '^@carbon/icons-react/es/(.*)$': '@carbon/icons-react/lib/$1',
    '^@carbon/charts': 'identity-obj-proxy',
    '^carbon-components-react/es/(.*)$': 'carbon-components-react/lib/$1',
    'lodash-es': 'lodash',
  },
  roots: ['src'],
  testMatch: ['<rootDir>/src/**/?(*.)test.{ts,tsx,js,jsx}'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  verbose: true,
  setupFilesAfterEnv: ['../../setupTests.js'],
  testEnvironment: 'jsdom',
  resetMocks: true,
  coveragePathIgnorePatterns: [],
  collectCoverageFrom: ['**/src/**/*.{js,ts,tsx}'],
  coverageThreshold: null,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
