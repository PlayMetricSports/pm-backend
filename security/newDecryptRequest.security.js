const { decryptData } = require("@/security/rsa.keys.security");

const DecryptRequest = (request, response, next) => {
    try {
        request.body = decryptData(request.body);
        next();
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }

}

module.exports = DecryptRequest;