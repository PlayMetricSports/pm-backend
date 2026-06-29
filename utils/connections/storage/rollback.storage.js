const storage = require("@/utils/connections/storage/connect.storage");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
// eslint-disable-next-line no-redeclare
const File = require("@/models/file/file.model");

const RollbackStorage = async (Bucket, database) => {
    console.warn("Error: Rolling back files")

    for (const params of Bucket) {
        await storage.send(
            new DeleteObjectCommand({
                Bucket: params.Bucket,
                Key: params.Key,
            })
        );
    }
    await File.deleteMany({ _id: { $in: database } })

}

module.exports = RollbackStorage;