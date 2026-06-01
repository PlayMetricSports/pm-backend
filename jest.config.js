module.exports = {
    testEnvironment: "node",

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    },

    clearMocks: true,
    collectCoverage: true
};