const AWS = require("aws-sdk");

const storage = new AWS.S3({
    signatureVersion: "v4",
    endpoint: process.env.R2_ENDPOINT,
    region: process.env.R2_REGION,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_ACCESS_SECRET
    }
})

module.exports = storage;