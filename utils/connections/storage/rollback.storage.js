const storage = require("@/utils/connections/storage/connect.storage");
// eslint-disable-next-line no-redeclare
const File = require("@/models/file/file.model");

const RollbackStorage = async (Bucket, database) => {
    console.warn("Error: Rolling back files")
    for (const params of Bucket) {
        const keys = {
            Bucket: params.Bucket,
            Key: params.Key
        }
        await storage.deleteObject(keys).promise();

    }
    await File.deleteMany({ _id: { $in: database } })

}

module.exports = RollbackStorage;