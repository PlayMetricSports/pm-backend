const ZoomMiddleware = async (request, response, next) => {
    const timestamp = request.headers["x-zm-request-timestamp"];
    const message = `v0:${timestamp}:${JSON.stringify(request.body)}`;

    const hashForVerify = crypto.createHmac("sha256", process.env.ZOOM_SECRET_TOKEN).update(message).digest("hex");

    const signature = `v0=${hashForVerify}`;

    if (signature === request.headers["x-zm-signature"]) {
        if (request.body.event === "endpoint.url_validation") {
            const hashForValidate = crypto.createHmac("sha256", process.env.ZOOM_SECRET_TOKEN).update(request.body.payload.plainToken).digest("hex");

            return response.status(200).json({
                plainToken: request.body.payload.plainToken,
                encryptedToken: hashForValidate
            })
        }
        else {
            next();
        }
    }
    else {
        return response.status(200).json({
            status: 200,
            message: "Unauthorized request to zoom pull recording request."
        });
    }
}

module.exports = ZoomMiddleware;