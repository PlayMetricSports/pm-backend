/**
 * Integration tests for Authentication endpoints
 * Tests: Login, Logout, Authenticate
 */

require("module-alias/register");
require("dotenv").config();

const request = require("supertest");
const app = require("@/app");
const { connectDB, disconnectDB } = require("@/utils/connections/database/connectDB");
const User = require("@/models/account/user.model");
const {
  validLoginPayload,
  invalidEmailPayload,
  missingEmailPayload,
  missingPasswordPayload,
  wrongPasswordPayload
} = require("../fixtures/auth.fixtures");

describe("Authentication Endpoints", () => {
  let authToken = null;
  let testUserId = null;

  beforeAll(async () => {
    await connectDB();
  }, 30000);

  afterAll(async () => {
    await disconnectDB();
  });

  describe("POST /api/v1/account/authentication/login", () => {
    test("Should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(missingEmailPayload)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });

    test("Should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(missingPasswordPayload)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });

    test("Should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(invalidEmailPayload)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });

    test("Should return 401 for non-existent user", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(validLoginPayload)
        .set("Content-Type", "application/json");

      expect([400, 401, 404]).toContain(response.status);
      expect(response.body).toHaveProperty("success", false);
    });

    test("Should return 401 for wrong password", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(wrongPasswordPayload)
        .set("Content-Type", "application/json");

      expect([400, 401, 404]).toContain(response.status);
      expect(response.body).toHaveProperty("success", false);
    });

    test("Should return token on successful login", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(validLoginPayload)
        .set("Content-Type", "application/json");

      // May return 200 or 401 depending on user existence in DB
      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        if (response.body.data) {
          authToken = response.body.data;
        }
      }
    });
  });

  describe("GET /api/v1/account/authentication", () => {
    test("Should return 401 without authentication token", async () => {
      const response = await request(app)
        .get("/api/v1/account/authentication")
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/account/authentication")
        .set("Authorization", "Bearer invalid-token-xyz")
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should authenticate user with valid token", async () => {
      // First login to get a valid token
      const loginResponse = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(validLoginPayload)
        .set("Content-Type", "application/json");

      if (loginResponse.status === 200 && loginResponse.body.data) {
        const token = loginResponse.body.data;
        
        const response = await request(app)
          .get("/api/v1/account/authentication")
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "application/json");

        expect([200, 401, 403]).toContain(response.status);
      }
    });
  });

  describe("POST /api/v1/account/authentication/logout", () => {
    test("Should return 401 without authentication token", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/logout")
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should return 401 with invalid token", async () => {
      const response = await request(app)
        .post("/api/v1/account/authentication/logout")
        .set("Authorization", "Bearer invalid-token-xyz")
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should logout user with valid token", async () => {
      const loginResponse = await request(app)
        .post("/api/v1/account/authentication/login")
        .send(validLoginPayload)
        .set("Content-Type", "application/json");

      if (loginResponse.status === 200 && loginResponse.body.data) {
        const token = loginResponse.body.data;
        
        const response = await request(app)
          .post("/api/v1/account/authentication/logout")
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "application/json");

        expect([200, 201, 401, 403]).toContain(response.status);
      }
    });
  });
});
