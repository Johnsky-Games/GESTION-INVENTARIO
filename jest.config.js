// jest.config.js (ESM)
export default {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
