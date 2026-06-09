/**
 * Test fixtures for profile endpoints
 */

const validUpdateProfilePayload = {
  firstName: "Updated",
  lastName: "Name",
  phone: "9876543210",
  profilePicture: "https://example.com/pic.jpg"
};

const validChangePasswordPayload = {
  currentPassword: "OldPassword@123",
  newPassword: "NewPassword@123",
  confirmPassword: "NewPassword@123"
};

const invalidChangePasswordPayload = {
  currentPassword: "OldPassword@123",
  newPassword: "NewPassword@123",
  confirmPassword: "DifferentPassword@123"
};

const missingPasswordPayload = {
  currentPassword: "OldPassword@123"
};

const validSendOTPPayload = {
  email: "user@example.com"
};

const validVerifyEmailPayload = {
  email: "user@example.com",
  otp: "123456"
};

module.exports = {
  validUpdateProfilePayload,
  validChangePasswordPayload,
  invalidChangePasswordPayload,
  missingPasswordPayload,
  validSendOTPPayload,
  validVerifyEmailPayload
};
