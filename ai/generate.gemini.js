const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GenerateGeminiAI = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

        if (isEmpty(prompt)) {
            return {
                success: false,
                error: "Please add a prompt."
            };
        }
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return {
            success: true,
            data: text
        };
    }
    catch (error) {
        console.log(error)
        return {
            status: error?.status,

            success: false,
            error: {
                field: error?.statusText,
                message: `${error}`
            }
        };
    }
};

module.exports = GenerateGeminiAI;