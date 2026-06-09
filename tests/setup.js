require("module-alias/register");
require("dotenv").config();

let dbConnected = false;

// Setup and teardown for all tests
beforeAll(async () => {
  try {
    const { connectDB } = require("@/utils/connections/database/connectDB");
    await connectDB();
    dbConnected = true;
    console.log("✅ Database connected for tests");
  } catch (error) {
    console.warn("⚠️  Database connection failed, running tests in mock mode:", error.message);
    dbConnected = false;
    // Don't exit - tests can still run with mocked data
  }
}, 30000);

afterAll(async () => {
  if (dbConnected) {
    try {
      const { disconnectDB } = require("@/utils/connections/database/connectDB");
      await disconnectDB();
      console.log("✅ Database disconnected after tests");
    } catch (error) {
      console.warn("⚠️  Error disconnecting database:", error.message);
    }
  }
});

// Make database connection status available to tests
global.dbConnected = () => dbConnected;

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
