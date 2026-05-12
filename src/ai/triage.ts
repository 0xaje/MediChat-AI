import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";
import { SYSTEM_PROMPT } from "./prompts.js";
import { detectEmergency } from "./emergency.js";
import { tools, handleToolCall } from "./tools.js";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
  tools: [{ functionDeclarations: tools.map((t: any) => t.function) }],
});

// Simple in-memory conversation history
// Gemini uses a different structure for history
const chatSessions = new Map<string, any>();

export async function processHealthMessage(
  userId: string,
  text: string
) {
  // Emergency Handling (Pre-check)
  if (detectEmergency(text)) {
    return `
🚨 Your symptoms may require urgent medical attention.

Please contact emergency services or visit the nearest hospital immediately.

If possible:
• Stay with someone
• Avoid being alone
• Seek professional medical help now

MediChat AI is not a replacement for emergency care.
`;
  }

  // Get or initialize chat session
  let chat = chatSessions.get(userId);
  if (!chat) {
    chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.5,
      },
    });
    chatSessions.set(userId, chat);
  }

  try {
    const result = await chat.sendMessage(text);
    const response = await result.response;
    
    // Check for tool calls
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      console.log(`🛠️ AI requested ${functionCalls.length} tool calls`);
      
      const functionResponses = await Promise.all(
        functionCalls.map(async (call: any) => {
          const toolResult = await handleToolCall(call.name, call.args, userId);
          return {
            functionResponse: {
              name: call.name,
              response: JSON.parse(toolResult)
            }
          };
        })
      );

      // Send tool results back to model
      const secondResult = await chat.sendMessage(functionResponses);
      return secondResult.response.text();
    }

    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    if (error.response) {
      console.error("Error Response:", JSON.stringify(error.response, null, 2));
    }
    if (error.message?.includes("API_KEY_INVALID")) {
      return "I'm sorry, there's a configuration issue with my AI service (Invalid API Key). Please check the environment variables.";
    }
    return `I'm sorry, I'm having trouble processing your request (Error: ${error.message}). Please try again later.`;
  }
}
