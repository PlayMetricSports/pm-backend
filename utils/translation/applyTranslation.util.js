const Translation = require("@/models/translation/translation.model");

const SUPPORTED_LANGS = ["hi", "or"];

// yeh fixed values hai
const STATIC_TRANSLATIONS = {
    day: {
        hi: {
            monday: "सोमवार", tuesday: "मंगलवार", wednesday: "बुधवार",
            thursday: "गुरुवार", friday: "शुक्रवार", saturday: "शनिवार",
            sunday: "रविवार"
        },
        or: {
            monday: "ସୋମବାର", tuesday: "ମଙ୍ଗଳବାର", wednesday: "ବୁଧବାର",
            thursday: "ଗୁରୁବାର", friday: "ଶୁକ୍ରବାର", saturday: "ଶନିବାର",
            sunday: "ରବିବାର"
        }
    },
    month: {
        hi: {
            "january": "जनवरी", "february": "फरवरी", "march": "मार्च",
            "april": "अप्रैल", "may": "मई", "june": "जून",
            "july": "जुलाई", "august": "अगस्त", "september": "सितंबर",
            "october": "अक्टूबर", "november": "नवंबर", "december": "दिसंबर"
        },
        or: {
            "january": "ଜାନୁଆରୀ", "february": "ଫେବ୍ରୁଆରୀ", "march": "ମାର୍ଚ୍ଚ",
            "april": "ଏପ୍ରିଲ", "may": "ମଇ", "june": "ଜୁନ",
            "july": "ଜୁಲାଇ", "august": "ଅଗଷ୍ଟ", "september": "ସେପ୍ଟେମ୍ବର",
            "october": "ଅକ୍ଟୋବର", "november": "ନଭେମ୍ବର", "december": "ଡିସେମ୍ବର"
        },
    },
    componentType: {
        hi: {
            "Assignment": "असाइनमेंट", "Class Test": "कक्षा परीक्षण",
            "Revision Test": "पुनरीक्षण परीक्षण", "Exam": "परीक्षा"
        },
        or: {
            "Assignment": "ଆସାଇନମେଣ୍ଟ", "Class Test": "ଶ୍ରେଣୀ ପରୀକ୍ଷା",
            "Revision Test": "ପୁନରାବୃତ୍ତି ପରୀକ୍ଷା", "Exam": "ପରୀକ୍ଷା"
        }
    },
    termName: {
        hi: {
            "Term": "सत्र", "Full Year": "पूर्ण वर्ष",
            "Semester": "सेमेस्टर", "Tri Semester": "त्रि सेमेस्टर"
        },
        or: {
            "Term": "ଟର୍ମ", "Full Year": "ପୂର୍ଣ୍ଣ ବର୍ଷ",
            "Semester": "ସେମିଷ୍ଟର", "Tri Semester": "ତ୍ରି ସେମିଷ୍ଟର"
        }
    },
    ticketStatus: {
        hi: { "Open": "खुला", "On-Hold": "रोका गया", "Closed": "बंद" },
        or: { "Open": "ଖୋଲା", "On-Hold": "ରୋକା ଗଲା", "Closed": "ବନ୍ଦ" }
    },
    ticketPriority: {
        hi: { "High": "उच्च", "Medium": "मध्यम", "Low": "निम्न" },
        or: { "High": "ଉଚ୍ଚ", "Medium": "ମଧ୍ୟମ", "Low": "କମ" }
    },
    ticketCategory: {
        hi: { "General": "सामान्य", "Academics": "शैक्षणिक", "Books": "पुस्तकें", "Fees": "शुल्क", "Classes": "कक्षाएं", "Exam": "परीक्षा" },
        or: { "General": "ସାଧାରଣ", "Academics": "ଶୈକ୍ଷଣିକ", "Books": "ପୁସ୍ତକ", "Fees": "ଶୁଳ୍କ", "Classes": "ଶ୍ରେଣୀ", "Exam": "ପରୀକ୍ଷା" }
    },
    replyStatus: {
        hi: { "Replied": "उत्तर दिया", "Waiting": "प्रतीक्षा में" },
        or: { "Replied": "ଉତ୍ତର ଦିଆଗଲା", "Waiting": "ଅପେକ୍ଷା କରୁଛି" }
    },
    tripType: {
        hi: { "arrival": "आगमन", "departure": "प्रस्थान", "others": "अन्य" },
        or: { "arrival": "ଆଗମନ", "departure": "ପ୍ରସ୍ଥାନ", "others": "ଅନ୍ୟ" }
    },
    tripShift: {
        hi: { "morning": "सुबह", "afternoon": "दोपहर", "evening": "शाम" },
        or: { "morning": "ସକାଳ", "afternoon": "ଦୁପହର", "evening": "ସନ୍ଧ୍ୟା" }
    },
    allocationStatus: {
        hi: { "active": "सक्रिय", "inactive": "निष्क्रिय" },
        or: { "active": "ସକ୍ରିୟ", "inactive": "ନିଷ୍କ୍ରିୟ" }
    },
    progressStatus: {
        hi: { "not-started": "शुरू नहीं हुआ", "in-progress": "जारी है", "completed": "पूर्ण" },
        or: { "not-started": "ଆରମ୍ଭ ହୋଇନାହିଁ", "in-progress": "ଚାଲୁ ଅଛି", "completed": "ସମ୍ପୂର୍ଣ୍ଣ" }
    },
    chapterStatus: {
        hi: { "Done": "हो गया", "Not Done": "नहीं हुआ" },
        or: { "Done": "ହୋଇଗଲା", "Not Done": "ହୋଇନାହିଁ" }
    }
};

function isValidLang(lang) {
    return !!lang && lang !== "en" && SUPPORTED_LANGS.includes(lang);
}

function convertFieldsToPlainObject(fields) {
    if (!fields) return {};
    if (fields instanceof Map) return Object.fromEntries(fields);
    return fields;
}

function splitPathIntoSteps(path) {
    if (!path || path === "self") return [];
    return path.split(".").filter(Boolean);
}

function getNodesByPath(obj, path) {
    const steps = splitPathIntoSteps(path);
    if (!steps.length) return obj ? [obj] : [];

    function traverse(currentObj, stepIndex) {
        if (currentObj == null) return [];
        if (stepIndex === steps.length) return [currentObj];

        const step = steps[stepIndex];
        const isArrayStep = step.endsWith("[]");
        const fieldName = isArrayStep ? step.slice(0, -2) : step;
        const fieldValue = currentObj[fieldName];

        if (fieldValue == null) return [];

        if (isArrayStep) {
            if (!Array.isArray(fieldValue)) return [];
            let collected = [];
            for (const arrayItem of fieldValue) {
                collected = collected.concat(traverse(arrayItem, stepIndex + 1));
            }
            return collected;
        }

        return traverse(fieldValue, stepIndex + 1);
    }

    return traverse(obj, 0);
}

// static translations ke liye value directly replace karna hai isliye ref chahiye
function getFieldRefsByPath(obj, path) {
    const steps = splitPathIntoSteps(path);
    if (!steps.length) return [];

    function traverse(currentObj, stepIndex) {
        if (currentObj == null) return [];

        const step = steps[stepIndex];
        const isArrayStep = step.endsWith("[]");
        const fieldName = isArrayStep ? step.slice(0, -2) : step;
        const isLastStep = stepIndex === steps.length - 1;

        if (isLastStep) {
            if (isArrayStep) {
                const arr = currentObj[fieldName];
                if (!Array.isArray(arr)) return [];
                return arr.map((value, index) => ({ parent: arr, key: index, value }));
            }
            if (!(fieldName in currentObj)) return [];
            return [{ parent: currentObj, key: fieldName, value: currentObj[fieldName] }];
        }

        const fieldValue = currentObj[fieldName];
        if (fieldValue == null) return [];

        if (isArrayStep) {
            if (!Array.isArray(fieldValue)) return [];
            let collected = [];
            for (const arrayItem of fieldValue) {
                collected = collected.concat(traverse(arrayItem, stepIndex + 1));
            }
            return collected;
        }

        return traverse(fieldValue, stepIndex + 1);
    }

    return traverse(obj, 0);
}

// response mein English ki jagah translated values daal do
async function localizeResponse({ data, lang, config = {} }) {
    try {
        if (!data) return data;
        if (!isValidLang(lang)) return data;

        const documents = Array.isArray(data) ? data : [data];
        const modelRules = Array.isArray(config.modelRules) ? config.modelRules : [];
        const staticRules = Array.isArray(config.staticRules) ? config.staticRules : [];

        const idsByModelName = {};
        for (const rule of modelRules) {
            const { modelName, path = "self" } = rule;
            if (!modelName) continue;
            if (!idsByModelName[modelName]) idsByModelName[modelName] = new Set();
            for (const doc of documents) {
                const matchingNodes = getNodesByPath(doc, path);
                for (const node of matchingNodes) {
                    if (node?._id) idsByModelName[modelName].add(node._id.toString());
                }
            }
        }

        const translationsByModelName = {};
        for (const [modelName, idSet] of Object.entries(idsByModelName)) {
            const refIds = Array.from(idSet);
            if (!refIds.length) continue;

            const foundTranslations = await Translation.find({
                modelName,
                refId: { $in: refIds },
                lang,
                isActive: true
            }).lean();

            translationsByModelName[modelName] = {};
            for (const translation of foundTranslations) {
                const refIdStr = translation.refId.toString();
                translationsByModelName[modelName][refIdStr] = convertFieldsToPlainObject(translation.fields);
            }
        }

        // english fields ki jagah translated values set karo
        for (const rule of modelRules) {
            const { modelName, path = "self", fields = [] } = rule;
            if (!modelName || !fields.length) continue;

            const translationsForThisModel = translationsByModelName[modelName] || {};

            for (const doc of documents) {
                const matchingNodes = getNodesByPath(doc, path);
                for (const node of matchingNodes) {
                    if (!node?._id) continue;
                    const nodeTranslation = translationsForThisModel[node._id.toString()];
                    if (!nodeTranslation) continue;
                    for (const fieldName of fields) {
                        if (nodeTranslation[fieldName]) {
                            node[fieldName] = nodeTranslation[fieldName];
                        }
                    }
                }
            }
        }

        for (const rule of staticRules) {
            const { type, path } = rule;
            if (!type || !path) continue;
            const translationLookup = STATIC_TRANSLATIONS[type]?.[lang];
            if (!translationLookup) continue;

            for (const doc of documents) {
                const fieldRefs = getFieldRefsByPath(doc, path);
                for (const ref of fieldRefs) {
                    const hasTranslation = typeof ref.value === "string" && translationLookup[ref.value];
                    if (hasTranslation) {
                        ref.parent[ref.key] = translationLookup[ref.value];
                    }
                }
            }
        }

        return data;

    } catch (err) {
        console.error("localizeResponse error:", err.message);
        return data;
    }
}

async function applyTranslations({ docs, modelName, fields, lang }) {
    try {
        if (!docs || !Array.isArray(docs) || !docs.length) return docs;
        await localizeResponse({
            data: docs,
            lang,
            config: { modelRules: [{ modelName, path: "self", fields }] }
        });
        return docs;
    } catch (err) {
        console.error("applyTranslations error:", err.message);
        return docs;
    }
}

async function applyTranslationSingle({ doc, modelName, fields, lang }) {
    try {
        if (!doc) return doc;
        await localizeResponse({
            data: doc,
            lang,
            config: { modelRules: [{ modelName, path: "self", fields }] }
        });
        return doc;
    } catch (err) {
        console.error("applyTranslationSingle error:", err.message);
        return doc;
    }
}

async function getTranslationMap({ refIds, modelName, lang }) {
    try {
        if (!isValidLang(lang) || !refIds?.length) return {};

        const foundTranslations = await Translation.find({
            modelName,
            refId: { $in: refIds },
            lang,
            isActive: true
        }).lean();

        const translationMap = {};
        for (const translation of foundTranslations) {
            translationMap[translation.refId.toString()] = convertFieldsToPlainObject(translation.fields);
        }

        return translationMap;

    } catch (err) {
        console.error("getTranslationMap error:", err.message);
        return {};
    }
}

function getTranslatedStaticValue({ type, value, lang }) {
    if (!isValidLang(lang)) return value;
    return STATIC_TRANSLATIONS?.[type]?.[lang]?.[value] || value;
}

function getTranslatedDay(dayName, lang) {
    return getTranslatedStaticValue({ type: "day", value: dayName, lang });
}

module.exports = {
    SUPPORTED_LANGS,
    STATIC_TRANSLATIONS,
    localizeResponse,
    applyTranslations,
    applyTranslationSingle,
    getTranslationMap,
    getTranslatedStaticValue,
    getTranslatedDay
};
