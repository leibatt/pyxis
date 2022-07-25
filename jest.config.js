module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/build','<rootDir>/build-test','<rootDir>/umd', `/node_modules/(?!vega-label)`]
};
