const express = require("express");
const router = express.Router();


// API Controllers Controllers
const GetUserRoleController = require("@/controllers/account/userRole/getUserRole.controller");
const GetUserRoleForSchoolERPController = require("@/controllers/account/userRole/getUserRoleForSchoolERP.controller");
const GetUserRoleValidator = require("@/validators/account/userRole/getUserRole.validator");

const CreateUserRoleController = require("@/controllers/account/userRole/createUserRole.controller");
const CreateUserRoleValidator = require("@/validators/account/userRole/createUserRole.validator");

const EditUserRoleController = require("@/controllers/account/userRole/editUserRole.controller");
const EditUserRoleValidator = require("@/validators/account/userRole/editUserRole.validator");

const UserRoleStatusToggleController = require("@/controllers/account/userRole/userRoleStatusToggle.controller");
const UserRoleStatusToggleValidator = require("@/validators/account/userRole/userRoleStatusToggle.validator");

const ActionMenuUserRoleController = require("@/controllers/account/userRole/actionMenuUserRole.controller");

const ActionIdUserRoleController = require("@/controllers/account/userRole/actionIdUserRole.controller");


// Request Body Decryption
const ActionMiddleware = require("@/utils/middleware/actionMiddleware");

const key = ["user-role"];

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: object
 *       properties:
 *         userRoleName:
 *           type: string
 *         userRoleKey:
 *           type: string
 *         userRoleStatus:
 *           type: string
 *         userType:
 *           type: string
 *         isAdmin:
 *           type: boolean
 *
 *     UserRoleResponse:
 *       type: object
 *       properties:
 *         userRole:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserRole'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             pageCount:
 *               type: integer
 *             total:
 *               type: integer
 *         userTypeArray:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: string
 *        Action:
 *          type: object
 *          properties:
 *            actionName:
          type: string
        actionKey:
          type: string
 */


/**
 * @swagger
 * /account/user-role:
 *   get:
 *     summary: Get user roles list
 *     description: Fetch paginated list of user roles along with distinct user types.
 *     tags: [User Role]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *     responses:
 *       200:
 *         description: User roles fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               success: true
 *               data:
 *                 userRole:
 *                   - userRoleName: "Admin"
 *                     userRoleKey: "admin"
 *                     userRoleStatus: "active"
 *                     userType: "admin"
 *                     isAdmin: true
 *                   - userRoleName: "Teacher"
 *                     userRoleKey: "teacher"
 *                     userRoleStatus: "active"
 *                     userType: "employee"
 *                     isAdmin: false
 *                 pagination:
 *                   page: 1
 *                   pageCount: 5
 *                   total: 50
 *                 userTypeArray:
 *                   - name: "Admin"
 *                     value: "admin"
 *                   - name: "Employee"
 *                     value: "employee"
 *               message: "User role fetched successfully."
 *               error: []
 *       200_NO_DATA:
 *         description: No user roles found
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               success: false
 *               error:
 *                 - field: "popup"
 *                   message: "No User role found."
 *               message: ""
 *       500:
 *         description: Server error
 */

router.get(
  /** 
    #swagger.path = '/api/v2/account/user-role'
    #swagger.tags = ['User Role']
    #swagger.summary = 'Get user roles list'
    #swagger.description = 'Fetch paginated list of user roles along with distinct user types.'

    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Page number (default is 1)',
      type: 'integer',
      example: 1
    }
    #swagger.responses[200] = {
    description: 'User roles fetched successfully',
    schema: {
      code: 200,
      success: true,
      data: {
        $ref: "#/definitions/UserRoleResponse"
      },
      message: "User role fetched successfully.",
      error: []
    }
    }
    #swagger.responses[204] = {
      description: 'No user roles found',
      schema: {
        code: 200,
        success: false,
        error: [
          {
            field: "popup",
            message: "No User role found."
          }
        ],
        message: ""
      }
    }
    #swagger.responses[500] = {
      description: 'Server error'
    }
    */

  "/",
  (request, response, next) => ActionMiddleware(request, response, next, key),
  GetUserRoleValidator,
  GetUserRoleController
);



/**
 * @swagger
 * /account/user-role:
 *   post:
 *     summary: Create a new user role
 *     description: |
 *       Creates a new user role with name, key, and user type.
 *       
 *       Note: The `data` field in response is encrypted.
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userRoleName
 *               - userRoleKey
 *               - userType
 *             properties:
 *               userRoleName:
 *                 type: string
 *                 example: "Teacher"
 *               userRoleKey:
 *                 type: string
 *                 example: "teacher"
 *               userType:
 *                 type: string
 */
router.post(
  "/",
  /*
      #swagger.path = '/api/v2/account/user-role/'
      #swagger.tags = ['User Role']
      #swagger.summary = 'Create a new user role'
      #swagger.description = 'Creates a new user role with name, key, and user type. Note: The `data` field in response is encrypted.'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Request Body',
        schema: {
          userRoleName: "Teacher",
          userRoleKey: "teacher",
          userType: "string"
        }
      }
  */
  (request, response, next) => ActionMiddleware(request, response, next, key),
  CreateUserRoleValidator,
  CreateUserRoleController
);

/**
 * @swagger
 * /account/user-role/edit/{id}:
 *   patch:
 *     summary: Update user role
 *     description: |
 *       Updates an existing user role by ID.
 *       - Maps provided `actionIds` (action keys) to actual action ObjectIds.
 *       - Updates role name, key, user type, and permissions.
 *     tags: [User Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Role ID
 *         example: "64f1a2b3c4d5e6f7890abc12"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userRoleName
 *               - userRoleKey
 *               - userType
 *               - actionIds
 *             properties:
 *               userRoleName:
 *                 type: string
 *                 example: "Teacher"
 *               userRoleKey:
 *                 type: string
 *                 example: "teacher"
 *               userType:
 *                 type: string
 *                 example: "employee"
 *               actionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of action keys
 *                 example: ["CREATE_USER", "VIEW_DASHBOARD"]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             example:
 *               code: 201
 *               success: true
 *               error: []
 *               message: "User role successfully updated."
 *       200_NOT_FOUND:
 *         description: User role not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               success: false
 *               error:
 *                 - field: "popup"
 *                   message: "User role not found."
 *               message: ""
 *       200_DUPLICATE:
 *         description: Duplicate user role name or key
 *         content:
 *           application/json:
 *             example:
 *               code: 400
 *               success: false
 *               error:
 *                 - field: "userRoleKey"
 *                   message: "user role key already exists."
 *               message: ""
 *       500:
 *         description: Internal server error
 */
router.patch(
  /* 
    #swagger.path = '/api/v2/account/user-role/edit/{id}'
    #swagger.tags = ['User Role']
    #swagger.summary = 'Update user role'
    #swagger.description = 'Updates an existing user role by ID. Maps actionIds (keys) to ObjectIds and updates role details.'

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User Role ID',
      required: true,
      type: 'string',
      example: "64f1a2b3c4d5e6f7890abc12"
    }

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'User role update payload',
      schema: {
        userRoleName: "Teacher",
        userRoleKey: "teacher",
        userType: "employee",
        actionIds: ["CREATE_USER", "VIEW_DASHBOARD"]
      }
    }

    #swagger.responses[200] = {
      description: 'User role updated successfully',
      schema: {
        code: 201,
        success: true,
        error: [],
        message: "User role successfully updated."
      }
    }

    #swagger.responses[404] = {
      description: 'User role not found',
      schema: {
        code: 404,
        success: false,
        error: [
          {
            field: "popup",
            message: "User role not found."
          }
        ],
        message: ""
      }
    }

    #swagger.responses[400] = {
      description: 'Duplicate user role name or key',
      schema: {
        code: 400,
        success: false,
        error: [
          {
            field: "userRoleKey",
            message: "user role key already exists."
          }
        ],
        message: ""
      }
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  "/edit/:id",
  (request, response, next) => ActionMiddleware(request, response, next, key),
  EditUserRoleValidator,
  EditUserRoleController
);

/**
 * @swagger
 * /account/user-role/toggle/status/{id}:
 *   patch:
 *     summary: Toggle user role status
 *     description: |
 *       Updates the status of a user role to either **active** or **inactive**.
 *     tags: [User Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Role ID
 *         example: "64f1a2b3c4d5e6f7890abc12"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userRoleStatus
 *             properties:
 *               userRoleStatus:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       200:
 *         description: User role status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               success: true
 *               error: []
 *               message: "User Role status changed to active successfully."
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/toggle/status/:id",
  /* 
      #swagger.path = '/api/v2/account/user-role/toggle/status/{id}'
      #swagger.tags = ['User Role']
      #swagger.summary = 'Toggle user role status'
      #swagger.description = 'Updates the status of a user role to either active or inactive.'

      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User Role ID',
        required: true,
        type: 'string',
        example: "64f1a2b3c4d5e6f7890abc12"
      }

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Status update payload',
        schema: {
          userRoleStatus: "active"
        },
        description: "Allowed values: active, inactive"
      }

      #swagger.responses[200] = {
        description: 'User role status updated successfully',
        schema: {
          code: 200,
          success: true,
          error: [],
          message: "User Role status changed to active successfully."
        }
      }

      #swagger.responses[400] = {
        description: 'Invalid input data'
      }

      #swagger.responses[500] = {
        description: 'Internal server error'
      }
 */
  (request, response, next) => ActionMiddleware(request, response, next, key),
  UserRoleStatusToggleValidator,
  UserRoleStatusToggleController
);

/**
 * @swagger
 * /account/user-role/action-menu:
 *   get:
 *     summary: Get action menu for user roles
 *     description: |
 *       Fetches the structured action menu used for assigning permissions to user roles.
 *       The menu is grouped by subsystem → module → submodule → actions.
 *       
 *       Note: The `data` field is encrypted.
 *     tags: [User Role]
 *     responses:
 *       200:
 *         description: Action menu fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               success: true
 *               data:
 *                 actionMenu:
 *                   - subSystemName: "ERP"
 *                     subSystemKey: "erp"
 *                     modules:
 *                       - moduleName: "Student"
 *                         moduleKey: "student"
 *                         moduleIcon: "user"
 *                         subModules:
 *                           - subModuleName: "Admission"
 *                             subModuleKey: "admission"
 *                             actions:
 *                               - actionName: "Create Admission"
 *                                 actionKey: "CREATE_ADMISSION"
 *                               - actionName: "View Admission"
 *                                 actionKey: "VIEW_ADMISSION"
 *                   - subSystemName: "LMS"
 *                     subSystemKey: "lms"
 *                     modules:
 *                       - moduleName: "Assignment"
 *                         moduleKey: "assignment"
 *                         subModules:
 *                           - subModuleName: "Homework"
 *                             subModuleKey: "homework"
 *                             actions:
 *                               - actionName: "Create Assignment"
 *                                 actionKey: "CREATE_ASSIGNMENT"
 *               error: []
 *               message: "Action menu fetched successfully."
 *       500:
 *         description: Internal server error
 */
router.get(
  /* 
      #swagger.path = '/api/v2/account/user-role/action-menu'
      #swagger.tags = ['User Role']
      #swagger.summary = 'Get action menu for user roles'
      #swagger.description = `Fetches the structured action menu used for assigning permissions to user roles.
The menu is grouped by subsystem → module → submodule → actions.

Note: The data field is encrypted.`

      #swagger.responses[200] = {
        description: 'Action menu fetched successfully',
        schema: {
          code: 200,
          success: true,
          data: {
            actionMenu: [
              {
                subSystemName: "ERP",
                subSystemKey: "erp",
                modules: [
                  {
                    moduleName: "Student",
                    moduleKey: "student",
                    moduleIcon: "user",
                    subModules: [
                      {
                        subModuleName: "Admission",
                        subModuleKey: "admission",
                        actions: [
                          {
                            actionName: "Create Admission",
                            actionKey: "CREATE_ADMISSION"
                          },
                          {
                            actionName: "View Admission",
                            actionKey: "VIEW_ADMISSION"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                subSystemName: "LMS",
                subSystemKey: "lms",
                modules: [
                  {
                    moduleName: "Assignment",
                    moduleKey: "assignment",
                    subModules: [
                      {
                        subModuleName: "Homework",
                        subModuleKey: "homework",
                        actions: [
                          {
                            actionName: "Create Assignment",
                            actionKey: "CREATE_ASSIGNMENT"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          error: [],
          message: "Action menu fetched successfully."
        }
      }  
      #swagger.responses[500] = {
        description: 'Server error'
      }
    */
  "/action-menu",
  (request, response, next) => ActionMiddleware(request, response, next, key),
  ActionMenuUserRoleController
);

router.get(
  /* 
      #swagger.path = '/api/v2/account/user-role/action-key/{id}'
      #swagger.tags = ['User Role']
      #swagger.summary = 'Get action keys by user role ID'
      #swagger.description = 'Fetches all action keys assigned to a specific user role using its ID. Returns encrypted data.'
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'User Role ID'
      }
      #swagger.responses[200] = {
        description: 'Action keys fetched successfully',
        schema: {
          code: 200,
          success: true,
          data: {
            actionKeys: ["CREATE_USER", "VIEW_DASHBOARD", "EDIT_PROFILE"]
          },
          error: [],
          message: "Action key fetched successfully."
        }
      }
      #swagger.responses[400] = {
        description: 'User role not found',
        schema: {
          code: 400,
          success: false,
          error: [
            {
              field: "popup",
              message: "User role not found"
            }
          ],
          message: ""
        }
      }
      #swagger.responses[500] = {
        description: 'Internal server error',
        schema: {
          code: 500,
          success: false,
          error: [
            {
              field: "popup",
              message: "Error: Something went wrong"
            }
          ],
          message: ""
        }
      }

    */
  "/action-key/:id",
  (request, response, next) => ActionMiddleware(request, response, next, key),
  ActionIdUserRoleController
);


module.exports = router;