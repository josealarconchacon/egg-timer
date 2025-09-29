export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.test.jsx"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "hooks/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/tests/**",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 34,
      functions: 66,
      lines: 59,
      statements: 60,
    },
  },
};
