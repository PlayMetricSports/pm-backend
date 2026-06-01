

// const crypto = require("crypto");

function encryptKeys(data) {
    return data;
}

function decryptKeys(encryptedData) {
    return encryptedData;
}
// function encryptKey(password) {
//     const cipher = crypto.createCipher("aes-256-cbc", process.env.RSA_SECRET);
//     let encrypted = cipher.update(password, "utf8", "base64");
//     encrypted += cipher.final("base64");
//     return encrypted;
// }

// function decryptKey(encryptedPassword) {
//     const decipher = crypto.createDecipher("aes-256-cbc", process.env.RSA_SECRET);
//     let decrypted = decipher.update(encryptedPassword, "base64", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
// }

// module.exports = {
//     encryptKey,
//     decryptKey
// }

function encryptPassword(password) {
    const crypto = require("crypto");
    const key = crypto.createHash("sha256")
        .update(process.env.RSA_SECRET)
        .digest();

    const iv = Buffer.alloc(16, 0); // fixed IV (NOT secure)

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(password, "utf8", "base64");
    encrypted += cipher.final("base64");

    return encrypted;
}

function decryptPassword(encryptedText) {
    const crypto = require("crypto");
    const key = crypto
        .createHash("sha256")
        .update(process.env.RSA_SECRET)
        .digest();

    const iv = Buffer.alloc(16, 0); // SAME IV used in encryption

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

function oldEncryptKey(password) {
    console.log("Using old encryption process which is deprecated");
    const cipher = crypto.createCipher("aes-256-cbc", process.env.RSA_SECRET);
    let encrypted = cipher.update(password, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function oldDecryptKey(encryptedPassword) {
    // newDecryptKey(encryptedPassword);
    const crypto = require("crypto");

    console.log("Using old decryption process which is deprecated");
    const decipher = crypto.createDecipher("aes-256-cbc", process.env.RSA_SECRET);
    let decrypted = decipher.update(encryptedPassword, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

function encryptKey(password, RSA_SECRET) {
    const crypto = require("crypto");
    // console.log("step1", password);

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    // console.log("step2 - IV generated", iv);

    // Derive a key from the secret using a proper key derivation function
    // const key = crypto.scryptSync(process.env.RSA_SECRET, 'salt', 32);
    // Replace scryptSync with pbkdf2Sync
    const key = crypto.pbkdf2Sync(RSA_SECRET, 'salt', 100000, 32, 'sha256');

    // Create cipher with explicit key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    // console.log("step3 - Cipher created", cipher);

    let encrypted = cipher.update(password, 'utf8', 'base64');
    // console.log("step4", encrypted);

    encrypted += cipher.final('base64');
    // console.log("step5", encrypted);

    // Combine IV and encrypted data (IV needs to be stored with the encrypted data)
    const combined = iv.toString('base64') + ':' + encrypted;
    // console.log("step6 - Final encrypted with IV", combined);

    return combined;
}


function decryptKey(encryptedPassword, RSA_SECRET) {
    const crypto = require("crypto");
    // Split the IV and encrypted data
    const parts = encryptedPassword.split(':');
    const iv = Buffer.from(parts[0], 'base64');
    const encryptedData = parts[1];


    // Derive the same key from the secret
    // const key = crypto.scryptSync(process.env.RSA_SECRET, 'salt', 32);
    const key = crypto.pbkdf2Sync(RSA_SECRET, 'salt', 100000, 32, 'sha256');

    // Create decipher with the key and IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}



function encryptData(data) {
    return encryptKey(JSON.stringify(data), process.env.RSA_SECRET)
}
function decryptData(encryptedData) {
    return JSON.parse(decryptKey(encryptedData, process.env.RSA_SECRET))
}
function zoomEncryptData(data) {
    return encryptKey(JSON.stringify(data), process.env.ZOOM_RSA_SECRET)
}
function zoomDecryptData(encryptedData) {
    return JSON.parse(decryptKey(encryptedData, process.env.ZOOM_RSA_SECRET))
}

module.exports = {
    encryptKeys,
    decryptKeys,
    encryptPassword,
    decryptPassword,
    oldEncryptKey,
    oldDecryptKey,
    encryptKey,
    decryptKey,
    encryptData,
    decryptData,
    zoomEncryptData,
    zoomDecryptData
}

