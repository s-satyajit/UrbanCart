import { env } from "../config/env.ts";
import { badRequestError } from "../middleware/error-handler.ts";

const geminiEndpoint = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.geminiApiKey}`;

export function isGeminiConfigured() {
  return Boolean(env.geminiApiKey);
}

async function callGemini(payload) {
  if (!isGeminiConfigured()) {
    throw badRequestError("Gemini is not configured. Add GEMINI_API_KEY.");
  }

  let response;
  try {
    response = await fetch(geminiEndpoint(env.geminiModel), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw badRequestError("Gemini is currently unreachable. Please try again shortly.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw badRequestError(
      data?.error?.message || "Gemini could not answer the question right now."
    );
  }

  return data;
}

function extractGeminiText(data) {
  const answer = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("\n")
    .trim();

  if (!answer) {
    throw badRequestError("Gemini returned an empty answer.");
  }

  return answer;
}

export async function askGeminiAboutStore(prompt) {
  const data = await callGemini({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 300,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  return extractGeminiText(data);
}

export async function createContactDraft({ name, email, prompt, channels = [] }) {
  const data = await callGemini({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "You write polished contact form drafts for Urban Cart.",
              "Return JSON only.",
              "Keep the tone professional, concise, and friendly.",
              "Do not mention AI or say the message was generated.",
              "Do not invent store policies.",
              "Do not add placeholders, order numbers, ticket IDs, or bracketed text unless the user provided them.",
              "",
              `Customer name: ${name}`,
              `Customer email: ${email}`,
              `What they want help with: ${prompt}`,
              "",
              "Support channels available:",
              ...channels.map(
                (channel) =>
                  `- ${channel.title}: ${channel.value} (${channel.description})`
              ),
            ].join("\n"),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 220,
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subject: {
            type: "string",
            description: "A concise, professional contact form subject line.",
          },
          howCanWeHelp: {
            type: "string",
            description:
              "A concise but useful website contact form message explaining the support request.",
          },
        },
        required: ["subject", "howCanWeHelp"],
      },
    },
  });

  let draft = null;
  try {
    draft = JSON.parse(extractGeminiText(data));
  } catch {
    throw badRequestError("Gemini returned an invalid contact draft.");
  }

  const subject = draft?.subject?.trim();
  const howCanWeHelp = draft?.howCanWeHelp?.trim();

  if (!subject || !howCanWeHelp) {
    throw badRequestError("Gemini returned an incomplete contact draft.");
  }

  return {
    subject,
    howCanWeHelp,
  };
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function interpretProductSearch({
  query,
  categories = [],
  brands = [],
  badges = [],
  titles = [],
}) {
  const fallback = {
    normalizedQuery: cleanString(query),
    keywords: [],
    categories: [],
    brands: [],
    badges: [],
    productTypes: [],
    usedAI: false,
  };

  if (!isGeminiConfigured()) {
    return fallback;
  }

  try {
    const data = await callGemini({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                "You help Urban Cart understand ecommerce product search queries.",
                "Return JSON only.",
                "Use categories, brands, and badges from the provided catalog lists when relevant.",
                "Infer likely product type references from natural language, but do not invent unavailable brands or products.",
                "Keep terms concise and useful for matching products.",
                "",
                `User search query: ${query}`,
                `Available categories: ${categories.join(", ") || "None"}`,
                `Available brands: ${brands.join(", ") || "None"}`,
                `Available badges: ${badges.join(", ") || "None"}`,
                `Available product titles: ${titles.join(", ") || "None"}`,
              ].join("\n"),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 220,
        thinkingConfig: {
          thinkingBudget: 0,
        },
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          additionalProperties: false,
          properties: {
            normalizedQuery: {
              type: "string",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
            },
            categories: {
              type: "array",
              items: { type: "string" },
            },
            brands: {
              type: "array",
              items: { type: "string" },
            },
            badges: {
              type: "array",
              items: { type: "string" },
            },
            productTypes: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "normalizedQuery",
            "keywords",
            "categories",
            "brands",
            "badges",
            "productTypes",
          ],
        },
      },
    });

    const parsed = JSON.parse(extractGeminiText(data));

    return {
      normalizedQuery: cleanString(parsed?.normalizedQuery) || fallback.normalizedQuery,
      keywords: safeArray(parsed?.keywords).map(cleanString).filter(Boolean),
      categories: safeArray(parsed?.categories).map(cleanString).filter(Boolean),
      brands: safeArray(parsed?.brands).map(cleanString).filter(Boolean),
      badges: safeArray(parsed?.badges).map(cleanString).filter(Boolean),
      productTypes: safeArray(parsed?.productTypes).map(cleanString).filter(Boolean),
      usedAI: true,
    };
  } catch {
    return fallback;
  }
}
