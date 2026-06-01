const File = require("@/models/file/file.model");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

const StoreFileLocally = async ({ buffer, originalFilename, createdBy, tenantCode = '0000' }) => {
    try {
        if (!originalFilename) {
            throw new Error("Original filename is required.");
        }

        const extension = originalFilename.split(".").pop();
        const mimetype = mime.lookup(extension) || "application/octet-stream";
        const size = buffer.length;

        const uploadPath = process.env.NEXT_PUBLIC_ENVIRONMENT !== "local"
            ? `../../../../uploads/${process.env.LOCAL_BUCKET}`
            : path.join(__dirname, "..", "..", "..", "..", "uploads", process.env.LOCAL_BUCKET, tenantCode);
        console.log(uploadPath)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
        const finalPath = path.join(uploadPath, uniqueName);

        fs.writeFileSync(finalPath, buffer);

        const addedFile = await File.create({
            name: originalFilename,
            alternative_text: originalFilename,
            caption: originalFilename,
            extension: extension,
            mime: mimetype,
            size: size,
            url: uniqueName,
            createdBy: createdBy,
            updatedBy: createdBy,
            used: true,
            storage: "local"
        });

        return addedFile;
    } catch (error) {
        throw new Error(`File storage failed: ${error.message}`);
    }
};

module.exports = StoreFileLocally;
