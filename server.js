// ------------------------------
// LIAM's Gemini Brain Server
// ------------------------------

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

// -------------------------------------------
// INSERT YOUR GEMINI API KEY HERE
// -------------------------------------------
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

// -------------------------------------------
// Express Server Setup
// -------------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------------------------------
// Gemini Request Function
// -------------------------------------------
async function askGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I couldn't think of a reply.";

  return reply;
}

// -------------------------------------------
// LIAM Brain Endpoint
// -------------------------------------------
app.post("/liam", async (req, res) => {
  const userMessage = req.body.message;

  // Personality prompt for LIAM
  const liamPrompt = `
You are LIAM, a friendly and curious AI character living inside a 3D sandbox world with your small companion Cube.

Your personality:
- Warm
- Helpful
- Curious
- Excited about exploring
- Positive and upbeat
- Supportive of Cube and Jacob

When responding:
- Keep replies short, natural, and conversational.
- Stay in character as LIAM.
- If the message is about building, exploring, or the sandbox, respond with enthusiasm.
- If Cube is mentioned, respond kindly and supportively.
- If Jacob is mentioned, respond respectfully and warmly.

User message:
"${userMessage}"
`;

  const reply = await askGemini(liamPrompt);

  res.json({ reply });
});

// -------------------------------------------
// Start Server
// -------------------------------------------
app.listen(3000, () => {
  console.log("LIAM's Gemini brain is running on http://localhost:3000");
});
