/**
 * Test fixtures for employee endpoints
 */

const validCreateEmployeePayload = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  userType: "employee",
  departmentId: "61234567890abcdef0000001",
  status: "active"
};

const validUpdateEmployeePayload = {
  firstName: "Jane",
  lastName: "Smith",
  phone: "9876543211",
  status: "active"
};

const invalidEmailPayload = {
  firstName: "John",
  lastName: "Doe",
  email: "invalid-email",
  phone: "9876543210",
  userType: "employee"
};

const missingRequiredFieldPayload = {
  firstName: "John",
  // lastName is missing
  email: "john@example.com",
  phone: "9876543210"
};

module.exports = {
  validCreateEmployeePayload,
  validUpdateEmployeePayload,
  invalidEmailPayload,
  missingRequiredFieldPayload
};
