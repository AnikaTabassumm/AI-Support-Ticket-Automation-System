const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeTicket(ticket) {
  const prompt = `
You are an AI customer support assistant.

Analyze this customer support ticket.

Subject: ${ticket.subject}
Message: ${ticket.message}

Return:
1. Category: Technical Issue, Billing, Account Access, or General Inquiry.
2. Priority: Low, Medium, High, or Critical.
3. Sentiment: Positive, Neutral, or Negative.
4. Suggested reply: A polite, professional response to the customer.

Do not invent facts or claim that an issue has been fixed.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          category: {
            type: "STRING",
            enum: [
              "Technical Issue",
              "Billing",
              "Account Access",
              "General Inquiry",
            ],
          },
          priority: {
            type: "STRING",
            enum: ["Low", "Medium", "High", "Critical"],
          },
          sentiment: {
            type: "STRING",
            enum: ["Positive", "Neutral", "Negative"],
          },
          suggested_reply: {
            type: "STRING",
          },
        },
        required: [
          "category",
          "priority",
          "sentiment",
          "suggested_reply",
        ],
      },
    },
  });

  const result = JSON.parse(response.text);

  return result;
}

module.exports = { analyzeTicket };