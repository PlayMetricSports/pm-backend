const swaggerAutogen = require("swagger-autogen")();

const docs = {
    info: {
        title: "E-School API v2",
        description: "API documentation for E-School v2 endpoints",
        version: "1.0.0",
    },
    host: `http://localhost:5001`,
    basePath: "/api/v2",
    schemes: ["http"],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter JWT token with Bearer prefix'
        }
    },
    definitions: {
        UserRole: {
            userRoleName: "Admin",
            userRoleKey: "admin",
            userRoleStatus: "active",
            userType: "admin",
            isAdmin: true
        },

        UserRoleResponse: {
            userRole: [
                {
                    $ref: "#/definitions/UserRole"
                }
            ],
            pagination: {
                page: 1,
                pageCount: 5,
                total: 50
            },
            userTypeArray: [
                {
                    name: "Admin",
                    value: "admin"
                }
            ]
        },

        Action: {
            actionName: "Create User",
            actionKey: "create_user"
        }
    },
    tags: [
        { name: "User", description: "User Management APIs" },
        { name: "User Role", description: "User Role Management APIs" },
        { name: "Authentication", description: "Login API" },
        { name: "Forgot Password", description: "Password Management APIs" },
        { name: "Temporary Admission", description: "Temporary Admission APIs" },
        { name: "Fee Account", description: "Fee Account APIs" },
    ],
    consumes: ["application/json"],
    produces: ["application/json"],
};

const outputFile = "./swagger.json";
const endpointsFiles = [
    '../routes/v2/**/*.js'
];

swaggerAutogen(outputFile, endpointsFiles, docs);