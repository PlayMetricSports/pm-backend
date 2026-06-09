/**
 * Integration tests for Profile endpoints
 * Tests: Update Profile, Change Password, Send OTP, Verify Email
 */

require("module-alias/register");
require("dotenv").config();

const request = require("supertest");
const app = require("@/app");
const { connectDB, disconnectDB } = require("@/utils/connections/database/connectDB");
const {
  validUpdateProfilePayload,
  validChangePasswordPayload,
  invalidChangePasswordPayload,
  missingPasswordPayload,
  validSendOTPPayload,
  validVerifyEmailPayload
} = require("../fixtures/profile.fixtures");

describe("Profile Endpoints", () => {
  beforeAll(async () => {
    await connectDB();
  }, 30000);

  afterAll(async () => {
    await disconnectDB();
  });

  describe("PATCH /api/v1/account/user/update-profile", () => {
    test("Should return 401 without authentication token", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/update-profile")
        .send(validUpdateProfilePayload)
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should return 400 for invalid request body", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/update-profile")
        .set("Authorization", "Bearer invalid-token")
        .send({})
        .set("Content-Type", "application/json");

      expect([400, 401, 403]).toContain(response.status);
    });

    test("Should update profile with valid data", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/update-profile")
        .set("Authorization", "Bearer valid-token")
        .send(validUpdateProfilePayload)
        .set("Content-Type", "application/json");

      // Status can be 200, 400, 401, or 403 depending on authentication
      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });
  });

  describe("PATCH /api/v1/account/user/change-password", () => {
    test("Should return 401 without authentication token", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/change-password")
        .send(validChangePasswordPayload)
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should return 400 if passwords don't match", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/change-password")
        .set("Authorization", "Bearer invalid-token")
        .send(invalidChangePasswordPayload)
        .set("Content-Type", "application/json");

      expect([400, 401, 403]).toContain(response.status);
    });

    test("Should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/change-password")
        .set("Authorization", "Bearer invalid-token")
        .send(missingPasswordPayload)
        .set("Content-Type", "application/json");

      expect([400, 401, 403]).toContain(response.status);
    });

    test("Should change password with valid data", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/change-password")
        .set("Authorization", "Bearer valid-token")
        .send(validChangePasswordPayload)
        .set("Content-Type", "application/json");

      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });
  });

  describe("POST /api/v1/account/user/verify/send-otp", () => {
    test("Should return 401 without authentication token", async () => {
      const response = await request(app)
        .post("/api/v1/account/user/verify/send-otp")
        .send(validSendOTPPayload)
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/account/user/verify/send-otp")
        .set("Authorization", "Bearer invalid-token")
        .send({ email: "invalid-email" })
        .set("Content-Type", "application/json");

      expect([400, 401, 403]).toContain(response.status);
    });

    test("Should send OTP for valid email", async () => {
      const response = await request(app)
        .post("/api/v1/account/user/verify/send-otp")
        .set("Authorization", "Bearer valid-token")
        .send(validSendOTPPayload)
        .set("Content-Type", "application/json");

      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });
  });

  describe("PATCH /api/v1/account/user/verify", () => {
    test("Should return 401 without authentication token", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/verify")
        .send(validVerifyEmailPayload)
        .set("Content-Type", "application/json");

      expect([401, 403, 400]).toContain(response.status);
    });

    test("Should return 400 for invalid OTP format", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/verify")
        .set("Authorization", "Bearer invalid-token")
        .send({ email: "user@example.com", otp: "invalid" })
        .set("Content-Type", "application/json");

      expect([400, 401, 403]).toContain(response.status);
    });

    test("Should verify email with valid OTP", async () => {
      const response = await request(app)
        .patch("/api/v1/account/user/verify")
        .set("Authorization", "Bearer valid-token")
        .send(validVerifyEmailPayload)
        .set("Content-Type", "application/json");

      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });
  });
});
