import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/src/**/*.(controller|service).ts'],
  coverageDirectory: './test/coverage',
  testEnvironment: 'node',
};
export default config;
