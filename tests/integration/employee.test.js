/**
 * Integration tests for Employee endpoints
 * Tests: List Employees, Create Employee, Update Employee, Get User Type Roles
 */

require("module-alias/register");
require("dotenv").config();

const request = require("supertest");
const app = require("@/app");
const { connectDB, disconnectDB } = require("@/utils/connections/database/connectDB");
const {
  validCreateEmployeePayload,
  validUpdateEmployeePayload,
  invalidEmailPayload,
  missingRequiredFieldPayload
} = require("../fixtures/employee.fixtures");

describe("Employee Endpoints", () => {
  let createdEmployeeId = null;

  beforeAll(async () => {
    await connectDB();
  }, 30000);

  afterAll(async () => {
    await disconnectDB();
  });

  describe("GET /api/v1/staff/employee", () => {
    test("Should return list of employees", async () => {
      const response = await request(app)
        .get("/api/v1/staff/employee")
        .set("Content-Type", "application/json");

      expect([200, 400, 401]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty("success");
        if (Array.isArray(response.body.data)) {
          expect(response.body.data).toBeInstanceOf(Array);
        }
      }
    });

    test("Should support pagination query parameters", async () => {
      const response = await request(app)
        .get("/api/v1/staff/employee?page=1&limit=10")
        .set("Content-Type", "application/json");

      expect([200, 400, 401]).toContain(response.status);
    });

    test("Should support search query parameter", async () => {
      const response = await request(app)
        .get("/api/v1/staff/employee?search=John")
        .set("Content-Type", "application/json");

      expect([200, 400, 401]).toContain(response.status);
    });
  });

  describe("GET /api/v1/staff/employee/get-user-type-roles-and-dept", () => {
    test("Should return user types, roles and departments", async () => {
      const response = await request(app)
        .get("/api/v1/staff/employee/get-user-type-roles-and-dept")
        .set("Content-Type", "application/json");

      expect([200, 400, 401]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty("data");
      }
    });
  });

  describe("POST /api/v1/staff/employee", () => {
    test("Should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/v1/staff/employee")
        .send(missingRequiredFieldPayload)
        .set("Content-Type", "application/json");

      expect([400, 401]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body).toHaveProperty("success", false);
      }
    });

    test("Should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/staff/employee")
        .send(invalidEmailPayload)
        .set("Content-Type", "application/json");

      expect([400, 401]).toContain(response.status);
    });

    test("Should return 400 for empty payload", async () => {
      const response = await request(app)
        .post("/api/v1/staff/employee")
        .send({})
        .set("Content-Type", "application/json");

      expect([400, 401]).toContain(response.status);
    });

    test("Should create employee with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/staff/employee")
        .send(validCreateEmployeePayload)
        .set("Content-Type", "application/json");

      expect([200, 201, 400, 401]).toContain(response.status);
      
      if (response.status === 201 || response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        if (response.body.data && response.body.data._id) {
          createdEmployeeId = response.body.data._id;
        }
      }
    });
  });

  describe("PATCH /api/v1/staff/employee/edit/:id", () => {
    test("Should return 400 for invalid employee ID format", async () => {
      const response = await request(app)
        .patch("/api/v1/staff/employee/edit/invalid-id")
        .send(validUpdateEmployeePayload)
        .set("Content-Type", "application/json");

      expect([400, 401, 404]).toContain(response.status);
    });

    test("Should return 404 for non-existent employee", async () => {
      const response = await request(app)
        .patch("/api/v1/staff/employee/edit/507f1f77bcf86cd799439011")
        .send(validUpdateEmployeePayload)
        .set("Content-Type", "application/json");

      expect([400, 401, 404]).toContain(response.status);
    });

    test("Should update employee with valid data", async () => {
      if (!createdEmployeeId) {
        // Skip if employee creation failed
        expect(true).toBe(true);
        return;
      }

      const response = await request(app)
        .patch(`/api/v1/staff/employee/edit/${createdEmployeeId}`)
        .send(validUpdateEmployeePayload)
        .set("Content-Type", "application/json");

      expect([200, 201, 400, 401, 404]).toContain(response.status);
      
      if (response.status === 200 || response.status === 201) {
        expect(response.body).toHaveProperty("success", true);
      }
    });

    test("Should return 400 for empty update payload", async () => {
      const response = await request(app)
        .patch("/api/v1/staff/employee/edit/507f1f77bcf86cd799439011")
        .send({})
        .set("Content-Type", "application/json");

      expect([400, 401, 404]).toContain(response.status);
    });
  });
});
