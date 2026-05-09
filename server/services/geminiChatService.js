import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askLegalAI = async (message) => {
  const model = genAI.getGenerativeModel({
    model:  "gemini-2.5-flash",
  });

  const prompt = `
You are LegalLogic AI, a professional legal assistant chatbot.

Help users understand:
- legal complaints
- cybercrime issues
- fraud cases
- evidence strength
- legal next steps
- FIR guidance
- consumer complaints
- case viability

Keep answers:
- professional
- concise
- beginner friendly
- legally cautious
- structured
- practical

User Query:
${message}
`;

  const result = await model.generateContent(prompt);

  const response = await result.response;

  return response.text();
};