const HINDI_LETTER_MAP = {
    A: "ए", B: "बी", C: "सी", D: "डी", E: "ई",
    F: "एफ", G: "जी", H: "एच", I: "आई", J: "जे",
    K: "के", L: "एल", M: "एम", N: "एन", O: "ओ",
    P: "पी", Q: "क्यू", R: "आर", S: "एस", T: "टी",
    U: "यू", V: "वी", W: "डब्ल्यू", X: "एक्स", Y: "वाई", Z: "जेड"
};

const ODIA_LETTER_MAP = {
    A: "ଏ", B: "ବି", C: "ସି", D: "ଡି", E: "ଇ",
    F: "ଏଫ", G: "ଜି", H: "ଏଚ", I: "ଆଇ", J: "ଜେ",
    K: "କେ", L: "ଏଲ", M: "ଏମ", N: "ଏନ", O: "ଓ",
    P: "ପି", Q: "କ୍ୟୁ", R: "ଆର", S: "ଏସ", T: "ଟି",
    U: "ୟୁ", V: "ଭି", W: "ଡବ୍ଲ୍ୟୁ", X: "ଏକ୍ସ", Y: "ୱାଇ", Z: "ଜେଡ"
};

const TOKEN_START = "ZXQNUM";
const TOKEN_END = "QXZ";

// to hide number from the google translation
function maskNumbers(text) {
    if (typeof text !== "string") return { text, numbers: [] };
    const numbers = [];
    const maskedText = text.replace(/\d+(\.\d+)?/g, (matchedNumber) => {
        const tokenIndex = numbers.length;
        numbers.push(matchedNumber);
        return `${TOKEN_START}${tokenIndex}${TOKEN_END}`;
    });
    return { text: maskedText, numbers };
}

// after translation add original numbers again
function restoreNumbers(translatedText, originalNumbers) {
    if (typeof translatedText !== "string") return translatedText;
    if (!originalNumbers.length) return translatedText;
    let result = translatedText;
    originalNumbers.forEach((number, index) => {
        const token = `${TOKEN_START}${index}${TOKEN_END}`;
        const safeToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(new RegExp(safeToken, "g"), number);
    });
    return result;
}

function isOnlyDigits(value) {
    if (typeof value !== "string") return false;
    return /^\d+(\.\d+)?$/.test(value.trim());
}

function looksLikeAbbreviation(value) {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    const onlyAllowedChars = /^[A-Z0-9\-\/\s]+$/.test(trimmed);
    const hasAtLeastOneLetter = /[A-Z]/.test(trimmed);
    return onlyAllowedChars && hasAtLeastOneLetter;
}

function transliterateAbbreviation(value, lang) {
    const letterMap = lang === "hi" ? HINDI_LETTER_MAP
        : lang === "or" ? ODIA_LETTER_MAP
            : null;
    if (!letterMap) return null;
    return value.split("").map((char) => {
        if (/[A-Z]/.test(char)) return letterMap[char] || char;
        return char;
    }).join("");
}

function getSpecialTranslation({ modelName, fieldName, lang, value }) {
    if (!value || typeof value !== "string") return null;
    const trimmedValue = value.trim();
    if (looksLikeAbbreviation(trimmedValue)) {
        return transliterateAbbreviation(trimmedValue, lang);
    }
    return null;
}

module.exports = {
    isOnlyDigits,
    looksLikeAbbreviation,
    transliterateAbbreviation,
    getSpecialTranslation,
    maskNumbers,
    restoreNumbers
};