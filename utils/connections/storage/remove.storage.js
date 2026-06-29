
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const storage = require("@/utils/connections/storage/connect.storage");

const RemoveStorage = async (key) => {
  console.log("=== DELETE REQUEST DETAILS ===");

  const result = await storage.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    })
  );

  console.log("Delete result:", result);
  console.log("=== DELETE SUCCESSFUL ===");
  return { success: true };

};

module.exports = RemoveStorage;



