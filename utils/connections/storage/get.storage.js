const storage = require("@/utils/connections/storage/connect.storage");

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
        // const url = storage.getSignedUrl("getObject", params);
        if (storagetype == "local") {
            url = `${process.env.LOCAL_PUBLIC_URL}/uploads/${key}`
            signedUrl = `${process.env.LOCAL_PUBLIC_URL}/uploads/${key}`
        } else {
            url = `${process.env.R2_PUBLIC_URL}/${key}`;
            signedUrl = storage.getSignedUrl("getObject", params);
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