// Express Router Setup
const express = require("express");
const router = express.Router();

// Middleware Controllers

// API Controllers Controllers
const UserChangePasswordController = require("@/controllers/account/user/userChangePassword.controller");
const UserChangePasswordValidator = require("@/validators/account/user/userChangePassword.validator");

const UserUpdateProfileController = require("@/controllers/account/user/userUpdateProfile.controller");
const UserUpdateProfileValidator = require("@/validators/account/user/userUpdateProfile.validator");

const UserSendOTPVerifyEmailController = require("@/controllers/account/user/userSendOTPVerifyEmail.controller");
const UserSendOTPVerifyEmailValidator = require("@/validators/account/user/userSendOTPVerifyEmail.validator");

const UserVerifyEmailController = require("@/controllers/account/user/userVerifyEmail.controller");
const UserVerifyEmailValidator = require("@/validators/account/user/userVerifyEmail.validator");

// JSON Body / Param Sanitization
// Request Body Decryption



router.patch(
    /* 
    #swagger.path = '/api/v2/account/user/update-profile'
    #swagger.method = 'patch'
    #swagger.tags = ['User']
    #swagger.summary = 'Short title of API'
    #swagger.description = 'Detailed description of what this API does'

    #swagger.security = [{
      "BearerAuth": []
    }]

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'Request payload',
      schema: {
        key1: "value",
        key2: "value"
      }
    }

    #swagger.parameters['paramName'] = {
      in: 'path',
      description: 'Path parameter',
      required: true,
      type: 'string'
    }

    #swagger.parameters['queryParam'] = {
      in: 'query',
      description: 'Query parameter',
      type: 'string'
    }

    #swagger.responses[200] = {
      description: 'Success response',
      schema: {
        code: 200,
        success: true,
        data: {},
        error: [],
        message: "Success"
      }
    }

    #swagger.responses[400] = {
      description: 'Bad request'
    }

    #swagger.responses[401] = {
      description: 'Unauthorized'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
    "/update-profile",
    UserUpdateProfileValidator,
    UserUpdateProfileController)


router.patch(
    /* 
    #swagger.path = '/api/v2/account/user/change-password'
   #swagger.method = 'patch'
   #swagger.tags = ['User']
   #swagger.summary = 'Short title of API'
   #swagger.description = 'Detailed description of what this API does'

   #swagger.security = [{
     "BearerAuth": []
   }]

   #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     description: 'Request payload',
     schema: {
       key1: "value",
       key2: "value"
     }
   }

   #swagger.parameters['paramName'] = {
     in: 'path',
     description: 'Path parameter',
     required: true,
     type: 'string'
   }

   #swagger.parameters['queryParam'] = {
     in: 'query',
     description: 'Query parameter',
     type: 'string'
   }

   #swagger.responses[200] = {
     description: 'Success response',
     schema: {
       code: 200,
       success: true,
       data: {},
       error: [],
       message: "Success"
     }
   }

   #swagger.responses[400] = {
     description: 'Bad request'
   }

   #swagger.responses[401] = {
     description: 'Unauthorized'
   }

   #swagger.responses[500] = {
     description: 'Internal server error'
   }
 */
    "/change-password", //   #swagger.tags = ['User']
    UserChangePasswordValidator,
    UserChangePasswordController
);

router.post(

    /*
    #swagger.path = '/api/v2/account/user/verify/send-otp'
    #swagger.tags = ['User']
    #swagger.summary = 'Short title of API'
    #swagger.description = 'Detailed description of what this API does'

    #swagger.security = [{
      "BearerAuth": []
    }]

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'Request payload',
      schema: {
        key1: "value",
        key2: "value"
      }
    }

    #swagger.parameters['paramName'] = {
      in: 'path',
      description: 'Path parameter',
      required: true,
      type: 'string'
    }

    #swagger.parameters['queryParam'] = {
      in: 'query',
      description: 'Query parameter',
      type: 'string'
    }

    #swagger.responses[200] = {
      description: 'Success response',
      schema: {
        code: 200,
        success: true,
        data: {},
        error: [],
        message: "Success"
      }
    }

    #swagger.responses[400] = {
      description: 'Bad request'
    }

    #swagger.responses[401] = {
      description: 'Unauthorized'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
 */
    "/verify/send-otp",
    UserSendOTPVerifyEmailValidator,
    UserSendOTPVerifyEmailController
);

router.patch(
    /* 
    #swagger.path = '/api/v2/account/user/verify'
   #swagger.method = 'METHOD'
   #swagger.tags = ['User']
   #swagger.summary = 'Short title of API'
   #swagger.description = 'Detailed description of what this API does'

   #swagger.security = [{
     "BearerAuth": []
   }]

   #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     description: 'Request payload',
     schema: {
       key1: "value",
       key2: "value"
     }
   }

   #swagger.parameters['paramName'] = {
     in: 'path',
     description: 'Path parameter',
     required: true,
     type: 'string'
   }

   #swagger.parameters['queryParam'] = {
     in: 'query',
     description: 'Query parameter',
     type: 'string'
   }

   #swagger.responses[200] = {
     description: 'Success response',
     schema: {
       code: 200,
       success: true,
       data: {},
       error: [],
       message: "Success"
     }
   }

   #swagger.responses[400] = {
     description: 'Bad request'
   }

   #swagger.responses[401] = {
     description: 'Unauthorized'
   }

   #swagger.responses[500] = {
     description: 'Internal server error'
   }
 */
    "/verify",
    UserVerifyEmailValidator,
    UserVerifyEmailController
);

module.exports = router;