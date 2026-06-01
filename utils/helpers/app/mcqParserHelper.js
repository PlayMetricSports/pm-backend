const parseMCQResponse = (rawText) => {
    try {
        const jsonMatch = rawText.match(/```json\n?([\s\S]*?)\n?```/) ||
            rawText.match(/(\[[\s\S]*\])/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }

        return null;
    } catch {
        return null;
    }
};

module.exports = { parseMCQResponse };