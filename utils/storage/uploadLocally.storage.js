const File = require("@/models/file/file.model");
const path = require('path');
const sanitize = require("sanitize-html");
const formidable = require("formidable");
const fs = require("fs");
const storage = require("@/utils/connections/storage/connect.storage");

const UploadtoLocalStorage = async (request, response, next, allowed, required) => {
    try {
        const uploadPath = process.env.NEXT_PUBLIC_ENVIRONMENT !== "local" ? `../../../../uploads/${process.env.LOCAL_BUCKET}` : path.join(__dirname, "..", "..", "..", "..", "uploads", process.env.LOCAL_BUCKET);
        const form = new formidable.IncomingForm();
        form.multiples = false;
        form.uploadDir = uploadPath;
        form.keepExtensions = true;
        const parseForm = () => {
            return new Promise((resolve, reject) => {
                form.parse(request, (error, fields, files) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ fields, files });
                    }
                });
            });
        };

        const { files, fields } = await parseForm();
        function sanitizeFormData(obj) {
            const sanitizedObj = {};
            for (const prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    const value = obj[prop][0];
                    let sanitizedValue;

                    if (typeof value != "object" || typeof value != "number") {
                        sanitizedValue = sanitize(value).trim();
                    }

                    sanitizedObj[prop] = sanitizedValue;
                }
            }
            return sanitizedObj;
        }

        const sanitized = sanitizeFormData(fields);
        const file = files?.attachment?.[0] || null;
        if (file) {
            const { mimetype, size, originalFilename, filepath } = file;
            // Check if originalFilename is defined before splitting
            const extension = originalFilename ? originalFilename.split(".").pop() : null;

            if (!extension) {
                return response.status(200).json({
                    code: 401,
                    success: false,
                    error: [
                        {
                            field: "attachment",
                            message: "File extension is missing or invalid."
                        }
                    ],
                    message: ""
                });
            }

            const rules = {
                image: {
                    size: 12000000, // 12MB
                    extension: ["png", "jpeg", "jpg"]
                },
                application: {
                    size: 75000000, // 75MB
                    extension: ["doc", "pdf", "xlsx", "csv", "txt"]
                },
                video: {
                    size: 100000000, // 100MB
                    extension: ["mp4", "mkv"]
                },
                audio: {
                    size: 10000000, // 10MB
                    extension: ["mp3"]
                }
            }

            const type = Object.keys(rules).find(key => rules[key].extension.includes(extension));

            if (!type || !allowed.includes(type)) {
                const allExtensions = allowed.flatMap(type => rules[type]?.extension || []);
                const extensionsString = allExtensions.join(", ");
                return response.status(200).json({
                    code: 401,
                    success: false,
                    error: [
                        {
                            field: "attachment",
                            message: `Only these file types are allowed (${extensionsString || "none"}).`
                        }
                    ],
                    message: ""
                });
            }

            if (size > rules[type].size) {
                return response.status(200).json({
                    code: 401,
                    success: false,
                    error: [
                        {
                            field: "",
                            message: `File size exceeds the limit (${rules[type].size}).`
                        }
                    ],
                    message: ""
                });
            }

            const name = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
            const tempPath = filepath; // in latest Formidable, it's `filepath`
            const finalPath = path.join(uploadPath, name);

            fs.rename(tempPath, finalPath, async (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                    return response.status(500).json({
                        error: [{
                            field: "popup",
                            message: 'Failed to save file.'
                        }]
                    });
                }

                const addedFile = await File.create({
                    name: originalFilename,
                    alternative_text: originalFilename,
                    caption: originalFilename,
                    extension: extension,
                    mime: mimetype,
                    size: size,
                    url: name,
                    createdBy: request?.user?._id,
                    updatedBy: request?.user?._id,
                    used: true,
                    storage: "local"
                });
                request.body = {
                    ...sanitized,
                    file: addedFile._id
                };
                next();
            });

        }
        else {
            if (required) {
                return response.status(200).json({
                    code: 404,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: "No file attached in the request."
                        }
                    ],
                    message: ""
                });
            } else {
                request.body = {
                    ...sanitized,
                };
                return next();
            }
        }
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
};

module.exports = UploadtoLocalStorage;
