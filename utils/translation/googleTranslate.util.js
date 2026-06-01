const { TranslationServiceClient } = require("@google-cloud/translate");
const path = require("path");
const { maskNumbers, restoreNumbers } = require("@/utils/translation/specialTranslation.util");

const KEY_FILE_PATH = path.resolve(process.cwd(), "keys/eduglobalschools-00975ad9d087.json");
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_LOCATION = "global";

const googleTranslateClient = new TranslationServiceClient({
    keyFilename: KEY_FILE_PATH
});

async function translateSingleText(text, targetLang) {
    try {
        const { text: maskedText, numbers: originalNumbers } = maskNumbers(text);

        const [response] = await googleTranslateClient.translateText({
            parent: `projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}`,
            contents: [maskedText],
            sourceLanguageCode: "en",
            targetLanguageCode: targetLang,
            mimeType: "text/plain"
        });

        const translatedText = response.translations?.[0]?.translatedText || null;
        if (!translatedText) return null;

        return restoreNumbers(translatedText, originalNumbers);

    } catch (err) {
        console.error("google translate failed for lang=" + targetLang + " text=" + text.slice(0, 50) + "...", err.message);
        return null;
    }
}

async function translateManyTexts(texts, targetLang) {
    if (!texts.length) return [];

    const CHUNK_SIZE = 128;
    const allResults = [];

    const preparedTexts = texts.map((text) => {
        const { text: maskedText, numbers: originalNumbers } = maskNumbers(text);
        return { maskedText, originalNumbers };
    });

    const chunks = [];
    for (let i = 0; i < preparedTexts.length; i += CHUNK_SIZE) {
        chunks.push(preparedTexts.slice(i, i + CHUNK_SIZE));
    }

    console.log(
        "sending " + texts.length + " texts to google translate for lang=" + targetLang +
        " (" + chunks.length + " chunk" + (chunks.length > 1 ? "s" : "") + ")"
    );

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const currentChunk = chunks[chunkIndex];
        const textsToSend = currentChunk.map((item) => item.maskedText);

        try {
            const [response] = await googleTranslateClient.translateText({
                parent: `projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}`,
                contents: textsToSend,
                sourceLanguageCode: "en",
                targetLanguageCode: targetLang,
                mimeType: "text/plain"
            });

            const translationsFromGoogle = response.translations || [];

            currentChunk.forEach((preparedItem, indexInChunk) => {
                const rawTranslated = translationsFromGoogle[indexInChunk]?.translatedText || null;
                if (rawTranslated) {
                    allResults.push(restoreNumbers(rawTranslated, preparedItem.originalNumbers));
                } else {
                    allResults.push(null);
                }
            });

            console.log("chunk " + (chunkIndex + 1) + "/" + chunks.length + " done");

            const isNotLastChunk = chunkIndex < chunks.length - 1;
            if (isNotLastChunk) {
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

        } catch (err) {
            console.error("chunk " + (chunkIndex + 1) + " failed:", err.message);
            currentChunk.forEach(() => allResults.push(null));
        }
    }

    return allResults;
}

module.exports = { translateSingleText, translateManyTexts };