module.exports = {
    testEnvironment: "node",

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    },

    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    
    testMatch: [
        "**/tests/**/*.test.js",
        "**/tests/**/*.spec.js"
    ],

    clearMocks: true,
    collectCoverage: true,
    
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/tests/fixtures/"
    ],

    testTimeout: 30000,
    
    verbose: true
};