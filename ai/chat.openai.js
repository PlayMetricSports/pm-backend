const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ChatOpenAI = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        return {
            success: true,
            data: response.choices[0].message.content,
        };
    }
    catch (error) {
        console.log(error)
        return {
            success: false,
            error: `Error: ${error.message}`,
        };
    }
}

module.exports = ChatOpenAI;