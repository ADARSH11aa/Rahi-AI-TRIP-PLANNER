// One-off diagnostic: lists the models your GEMINI_API_KEY can actually
// call, so we stop guessing model ID strings that change every few weeks.
//
// Run with: node src/listModels.js

import "dotenv/config";

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
);

if (!res.ok) {
  console.error("Failed to list models:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();

const usableModels = (data.models || []).filter((m) =>
  m.supportedGenerationMethods?.includes("generateContent")
);

console.log("Models your key can use for generateContent:\n");
for (const m of usableModels) {
  console.log(`- ${m.name.replace("models/", "")}  (${m.displayName})`);
}