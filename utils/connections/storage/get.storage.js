const storage = require("@/utils/connections/storage/connect.storage");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const GetStorage = async (key, storagetype = null) => {
    const params = {
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Expires: 60 * 5
    };
    let data = {};
    let url;
    let signedUrl = null;
    try {
        if (storagetype == "local") {
            url = `${process.env.LOCAL_PUBLIC_URL}/uploads/${key}`
            signedUrl = url
        } else {
            url = `${process.env.R2_PUBLIC_URL}/${key}`;
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: key,
            });
            signedUrl = await getSignedUrl(
                storage,
                command,
                { expiresIn: 60 * 5 } // 5 minutes
            );
        }
        data = {
            url,
            signedUrl
        }


        return {
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "File signed url created successfully."
        };

    } catch (error) {
        return {
            code: 404,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "File does not exist."
                }
            ]
        }
    }

}

module.exports = GetStorage;