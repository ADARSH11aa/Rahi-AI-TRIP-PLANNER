import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, buildUserMessage, buildRefineMessage, ItinerarySchema, DaySchema } from "./prompt.js";
import { searchPlaces, searchPlacesDeclaration } from "./placesApi.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-flash-lite-latest";

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function sendMessageWithRetry(chat, message, maxRetries = 4) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await chat.sendMessage({ message });
    } catch (err) {
      const isRateLimit =
        err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED");

      if (!isRateLimit || attempt === maxRetries) {
        throw err;
      }

      const match = err.message.match(/retryDelay["\s:]+"?(\d+)s/);
      const delaySeconds = match ? parseInt(match[1], 10) : 2 ** attempt * 2;
      const waitMs = (delaySeconds + 1) * 1000;

      console.log(
        `[rate limited] waiting ${delaySeconds}s before retry (attempt ${attempt + 1}/${maxRetries})...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

async function runGenerationTurn(chat, message) {
  let response = await sendMessageWithRetry(chat, message);

  for (let toolTurn = 0; toolTurn < 20; toolTurn++) {
    const functionCalls = response.functionCalls;
    if (!functionCalls || functionCalls.length === 0) {
      return response.text;
    }

    console.log(
      `[tool call ${toolTurn + 1}]`,
      functionCalls.map((c) => `${c.name}(${JSON.stringify(c.args)})`).join(", ")
    );

    const functionResponseParts = await Promise.all(
      functionCalls.map(async (call) => {
        try {
          const places = await searchPlaces(call.args.query);
          return { functionResponse: { name: call.name, response: { results: places } } };
        } catch (err) {
          return { functionResponse: { name: call.name, response: { error: err.message } } };
        }
      })
    );

    response = await sendMessageWithRetry(chat, functionResponseParts);
  }

  throw new Error("Exceeded max tool-call turns without a final response");
}

export async function generateItinerary(tripParams) {
  const userMessage = buildUserMessage(tripParams);

  const chat = ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: [searchPlacesDeclaration] }],
    },
  });

  let rawText = await runGenerationTurn(chat, userMessage);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = extractJson(rawText);
      const validated = ItinerarySchema.parse(parsed);
      return validated;
    } catch (err) {
      if (attempt === 1) {
        throw new Error(`Itinerary generation failed validation after retry: ${err.message}`);
      }
      const retryMessage = `Your previous response could not be parsed/validated: ${err.message}\nReturn ONLY the corrected raw JSON object, nothing else — no markdown fences.`;
      rawText = await runGenerationTurn(chat, retryMessage);
    }
  }
}

// Refines a single day of an existing itinerary based on a free-text
// instruction (e.g. "Reduce budget", "avoid crowds", or anything the user
// types into the AI copilot). Reuses the same search_places tool loop so
// any newly introduced place still gets verified with real coordinates.
export async function refineDay({ itinerary, day, instruction }) {
  const userMessage = buildRefineMessage({ itinerary, day, instruction });

  const chat = ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: [searchPlacesDeclaration] }],
    },
  });

  let rawText = await runGenerationTurn(chat, userMessage);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = extractJson(rawText);
      const validated = DaySchema.parse(parsed);
      return validated;
    } catch (err) {
      if (attempt === 1) {
        throw new Error(`Day refinement failed validation after retry: ${err.message}`);
      }
      const retryMessage = `Your previous response could not be parsed/validated: ${err.message}\nReturn ONLY the corrected raw JSON object for this single day, nothing else — no markdown fences.`;
      rawText = await runGenerationTurn(chat, retryMessage);
    }
  }
}