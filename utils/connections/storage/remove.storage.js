
const storage = require("@/utils/connections/storage/connect.storage");

const RemoveStorage = async (key) => {
  console.log("=== DELETE REQUEST DETAILS ===");

  const result = await storage.deleteObject({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  }).promise();

  console.log("Delete result:", result);
  console.log("=== DELETE SUCCESSFUL ===");
  return { success: true };

};

module.exports = RemoveStorage;



