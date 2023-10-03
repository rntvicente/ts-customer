export default {
  bail: 1,
  clearMocks: true,
  detectOpenHandles: true,
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**', '!<rootDir>/src/main.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'test/utils',
    'config/logger',
    'config/server',
    '/migration/',
  ],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  roots: ['<rootDir>/test', '<rootDir>/src'],
  transform: { '.+\\.ts$': '@swc/jest' },
  watchPathIgnorePatterns: ['globalConfig'],
  setupFiles: ['<rootDir>/.jest/setup.ts'],
  testEnvironmentOptions: {
    timeZone: 'America/Sao_Paulo',
  },
};
