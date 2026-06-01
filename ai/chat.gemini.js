const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const redis = require("redis");
// const {client} =redis.createClient();
// client.connect().catch(err => console.error("Redis connection error:", err));
const { client } = require("@/utils/connections/redis/redisClient");

const CHAT_PREFIX = "GCS:";

const isValidHistoryItem = (item) => {
    return (
        typeof item === "object" &&
        item !== null &&
        (item.role === "user" || item.role === "model") &&
        Array.isArray(item.parts) &&
        item.parts.every(p => typeof p === "object" && typeof p.text === "string")
    );
};

const ChatGeminiAI = async (sessionId, message) => {
    try {
        let history = [];

        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

            history.push({
                role: "user",
                parts: [{ text: typeof message === "string" ? message : JSON.stringify(message) }]
            });
        }
        else {
            const saved = await client.get(`${CHAT_PREFIX}${sessionId}`);

            if (saved) {
                const parsed = JSON.parse(saved);
                history = Array.isArray(parsed) ? parsed.filter(isValidHistoryItem) : [];

                // Append latest user message
                history.push({
                    role: "user",
                    parts: [{ text: typeof message === "string" ? message : JSON.stringify(message) }]
                });
            }
            else {
                return {
                    success: false,
                    error: "Session is invalid."
                };
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = model.startChat({ history });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        // history.push({ role: "model", parts: [{ text }] });
        history.push(
            { role: "user", parts: [{ text: message }] },
            { role: "model", parts: [{ text }] }
        );

        await client.set(`${CHAT_PREFIX}${sessionId}`, JSON.stringify(history), { EX: 86400 });

        return {
            success: true,
            data: text,
            sessionId: sessionId
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Error: ${error.message}`
        };
    }
};

module.exports = ChatGeminiAI;
