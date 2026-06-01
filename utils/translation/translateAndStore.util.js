const Translation = require("@/models/translation/translation.model");
const { translateSingleText } = require("@/utils/translation/googleTranslate.util");
const { isOnlyDigits, getSpecialTranslation } = require("@/utils/translation/specialTranslation.util");

const SUPPORTED_LANGS = ["hi", "or"];

async function translateAndStoreUtil({ modelName, refId, fields, langs }) {
    try {
        const targetLanguages = langs && langs.length > 0 ? langs : SUPPORTED_LANGS;

        for (const lang of targetLanguages) {
            const translatedFields = {};

            for (const [fieldName, englishValue] of Object.entries(fields)) {
                if (!englishValue || typeof englishValue !== "string") continue;

                const specialResult = getSpecialTranslation({ modelName, fieldName, lang, value: englishValue });
                if (specialResult) {
                    translatedFields[fieldName] = specialResult;
                    continue;
                }

                if (isOnlyDigits(englishValue)) continue;

                const translatedValue = await translateSingleText(englishValue, lang);
                if (!translatedValue) {
                    console.warn("translation failed for field=" + fieldName + " lang=" + lang);
                    continue;
                }

                translatedFields[fieldName] = translatedValue;
            }

            if (!Object.keys(translatedFields).length) {
                console.warn("no translations to save for " + modelName + " refId=" + refId + " lang=" + lang);
                continue;
            }

            await Translation.findOneAndUpdate(
                { modelName, refId, lang },
                { $set: { fields: translatedFields, isActive: true } },
                { upsert: true, new: true }
            );

            console.log("saved translation for " + modelName + " refId=" + refId + " lang=" + lang);
        }

    } catch (err) {
        console.error("translateAndStoreUtil failed for " + modelName + " refId=" + refId + ":", err.message);
        throw err;
    }
}

module.exports = { translateAndStoreUtil };