/** @type {import('ts-jest').JestConfigWithTsJest} */

import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
  };
};
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   // testMatch: ["**/**/*.test.js"],
//   // verbose: true,
//   // forceExit: true

// };
// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'jest-environment-jsdom',
//   transform: {
//       "^.+\\.tsx?$": "ts-jest" 
//   // process `*.tsx` files with `ts-jest`
//   },
//   moduleNameMapper: {
//       '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
//   },
// }

