const { defaults } = require('jest-config');

module.exports = {
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js', 'jsx'],
  roots: ['src'],
  testMatch: ['<rootDir>/src/**/?(*.)test.{ts,tsx,js,jsx}'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  // transformIgnorePatterns: ['<rootDir>/src/microFrontendLoader.js'],
  verbose: true,
  setupFilesAfterEnv: ['../../setupTests.ts'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true,
      },
    },
  },
};
