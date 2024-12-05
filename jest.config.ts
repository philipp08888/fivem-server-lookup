import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jsdom",
  testMatch: [
    "<rootDir>/tests/integration/frontend/**/*.test.{ts,tsx}",
    "<rootDir>/tests/integration/backend/**/*.test.ts",
  ],
};

export default createJestConfig(config);
