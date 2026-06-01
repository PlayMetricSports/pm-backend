const crypto = require("crypto");

function encryptKey(password) {
    const cipher = crypto.createCipher("aes-256-cbc", process.env.RSA_SECRET);
    let encrypted = cipher.update(password, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function decryptKey(encryptedPassword) {
    const decipher = crypto.createDecipher("aes-256-cbc", process.env.RSA_SECRET);
    let decrypted = decipher.update(encryptedPassword, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = {
    encryptKey,
    decryptKey
}