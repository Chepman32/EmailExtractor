module.exports = {
  testEnvironment: 'detox/runners/jest/testEnvironment',
  reporters: ['detox/runners/jest/reporter'],
  testMatch: ['**/*.e2e.js'],
  testTimeout: 120000,
  verbose: true,
};
