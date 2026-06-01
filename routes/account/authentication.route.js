// Express Router Setup
const express = require("express");
const router = express.Router();

// Middleware Controllers

// API Controllers Controllers
const LoginController = require("@/controllers/account/authentication/login/login.controller");
const LoginValidator = require("@/validators/account/authentication/login.validator");

const LogoutController = require("@/controllers/account/authentication/logout/logout.controller");

const AuthenticateController = require("@/controllers/account/authentication/persistence/authenticate.controller");

const Middleware = require("@/utils/middleware/middleware");

// JSON Body / Param Sanitization

// Request Body Decryption

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: password123
 */


/**
 * @swagger
 * /account/authentication/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user and return JWT token along with role-based data.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               success: true
 *               data: "ENCRYPTED_DATA"
 *               message: "Login successful"
 *               error: []
 *       401:
 *         description: Invalid credentials / inactive / blocked user
 *         content:
 *           application/json:
 *             example:
 *               code: 401
 *               success: false
 *               error:
 *                 - field: "email"
 *                   message: "The email or password that you've entered is incorrect."
 *               message: ""
 *       500:
 *         description: Server error
 */
router.post(
  /* 
      #swagger.path = '/api/v2/account/authentication/login'
      #swagger.tags = ['Authentication']
      #swagger.summary = 'User Login'
      #swagger.description = 'Authenticate user and return JWT token along with role-based data.'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Login payload',
        schema: {
          email: "user@example.com",
          password: "password123"
        }
      }
  
      #swagger.responses[200] = {
        description: 'Login successful',
        schema: {
          code: 200,
          success: true,
          data: "ENCRYPTED_DATA",
          message: "Login successful",
          error: []
        }
      }
  
      #swagger.responses[401] = {
        description: 'Invalid credentials / inactive / blocked user',
        schema: {
          code: 401,
          success: false,
          error: [
            {
              field: "email",
              message: "The email or password that you've entered is incorrect."
            }
          ],
          message: ""
        }
      }
  
      #swagger.responses[500] = {
        description: 'Server error'
      }
    */
  "/login",
  LoginValidator,
  LoginController
);

router.get(
  /* 
   #swagger.path = '/api/v2/account/authentication/'
   #swagger.tags = ['Authentication']
   #swagger.summary = 'User Verification'
   #swagger.description = 'Authenticate user during API call and return role-based data back to client.'
*/
  "/",
  Middleware,
  AuthenticateController
);

router.post(
  /* 
     #swagger.path = '/api/v2/account/authentication/logout'
     #swagger.tags = ['Authentication']
     #swagger.summary = 'User Logout'
     #swagger.description = 'Authenticate user during API call and return role-based data back to client.'
 */
  "/logout",
  Middleware,
  LogoutController
);

module.exports = router;