import { aboutContent, contactChannels } from "../constants/site-content.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { badRequestError } from "../middleware/error-handler.js";
import { Product } from "../models/Product.js";
import {
  askGeminiAboutStore,
  isGeminiConfigured,
} from "../services/gemini.service.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

async function buildAboutPayload() {
  const [productCount, featuredProducts, categories, priceRange] = await Promise.all([
    Product.countDocuments(),
    Product.find({ featured: true })
      .sort({ updatedAt: -1 })
      .limit(4)
      .select("title category price badge image")
      .lean(),
    Product.distinct("category"),
    Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]),
  ]);

  const resolvedCategories = categories.filter(Boolean);
  const pricing = priceRange[0] || { minPrice: 0, maxPrice: 0 };

  return {
    ...aboutContent,
    stats: [
      {
        label: "Products live",
        value: String(productCount),
        detail: "Backed by the real Urban Cart catalog.",
      },
      {
        label: "Categories",
        value: String(resolvedCategories.length),
        detail:
          resolvedCategories.slice(0, 4).join(", ") ||
          "Catalog categories are being curated.",
      },
      {
        label: "Price range",
        value:
          productCount > 0
            ? `${formatCurrency(pricing.minPrice)} - ${formatCurrency(pricing.maxPrice)}`
            : "Updating soon",
        detail: "Pulled from the current product collection.",
      },
    ],
    featuredProducts: featuredProducts.map((product) => ({
      id: product._id.toString(),
      title: product.title,
      category: product.category,
      badge: product.badge,
      price: product.price,
      image: product.image,
    })),
    ai: {
      title: "Ask about Urban Cart",
      subtitle:
        "Smart FAQs powered by Gemini and grounded in your current store data, policies, and support channels.",
      suggestions: aboutContent.faqSuggestions,
      enabled: isGeminiConfigured(),
    },
  };
}

export const getAbout = asyncHandler(async (req, res) => {
  const aboutPayload = await buildAboutPayload();
  res.json(aboutPayload);
});

export const askAboutUrbanCart = asyncHandler(async (req, res) => {
  const question = req.body?.question?.trim();

  if (!question) {
    throw badRequestError("Please enter a question for Urban Cart.");
  }

  if (question.length > 500) {
    throw badRequestError("Please keep your question under 500 characters.");
  }

  const aboutPayload = await buildAboutPayload();
  const productSnapshot = await Product.find({})
    .sort({ featured: -1, updatedAt: -1 })
    .limit(8)
    .select("title category price badge stock")
    .lean();

  const prompt = `
You are the AI assistant for Urban Cart, an ecommerce storefront.
Answer using only the store data below. Do not invent policies, delivery promises, or business details.
If the answer is not in the data, say that Urban Cart does not have that detail available yet and direct the user to contact support.
Keep the answer concise, practical, and customer-friendly.

STORE PROFILE
- Title: ${aboutPayload.title}
- Description: ${aboutPayload.description}
- Story: ${aboutPayload.story}
- Mission: ${aboutPayload.mission}

STORE HIGHLIGHTS
${aboutPayload.highlights.map((item) => `- ${item}`).join("\n")}

STORE VALUES
${aboutPayload.values
  .map((item) => `- ${item.title}: ${item.description}`)
  .join("\n")}

STORE POLICIES
${aboutPayload.policies
  .map((item) => `- ${item.title}: ${item.description}`)
  .join("\n")}

SUPPORT CHANNELS
${contactChannels
  .map((channel) => `- ${channel.title}: ${channel.value} (${channel.description})`)
  .join("\n")}

CATALOG SNAPSHOT
- Products live: ${aboutPayload.stats[0]?.value}
- Categories: ${aboutPayload.stats[1]?.detail}
- Price range: ${aboutPayload.stats[2]?.value}
${productSnapshot
  .map(
    (product) =>
      `- ${product.title} | Category: ${product.category} | Price: ${formatCurrency(product.price)} | Badge: ${
        product.badge || "None"
      } | Stock: ${product.stock}`
  )
  .join("\n")}

CUSTOMER QUESTION
${question}
`.trim();

  const answer = await askGeminiAboutStore(prompt);

  res.json({
    answer,
    suggestions: aboutPayload.ai.suggestions,
    groundedOn: [
      "Current product catalog",
      "Urban Cart brand story",
      "Store policies",
      "Support channels",
    ],
  });
});
