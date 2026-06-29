const { PutObjectCommand } = require("@aws-sdk/client-s3");
const storage = require("@/utils/connections/storage/connect.storage");
async function putStorage(params) {
    const { bucketName, fileName, fileBuffer, mimeType, ...rest } = params
    return await storage.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimeType,
            ...rest
        })
    );
}

module.exports = putStorage

