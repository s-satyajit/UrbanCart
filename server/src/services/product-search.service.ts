import { Product } from "../models/Product.ts";
import { interpretProductSearch } from "./gemini.service.ts";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "any",
  "best",
  "buy",
  "for",
  "from",
  "i",
  "in",
  "me",
  "need",
  "of",
  "on",
  "or",
  "please",
  "product",
  "products",
  "search",
  "show",
  "something",
  "that",
  "the",
  "to",
  "want",
  "with",
]);

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function includesTerm(fieldValue, term) {
  return normalizeText(fieldValue).includes(normalizeText(term));
}

function buildSearchTerms(query, interpretation) {
  return uniqueStrings([
    query,
    interpretation.normalizedQuery,
    ...tokenize(query),
    ...interpretation.keywords,
    ...interpretation.categories,
    ...interpretation.brands,
    ...interpretation.badges,
    ...interpretation.productTypes,
  ]).filter((term) => normalizeText(term).length > 1);
}

function scoreProduct(product, query, interpretation, searchTerms) {
  const normalizedQuery = normalizeText(interpretation.normalizedQuery || query);
  const title = normalizeText(product.title);
  const category = normalizeText(product.category);
  const brand = normalizeText(product.brand);
  const badge = normalizeText(product.badge);
  const description = normalizeText(product.description);
  const slug = normalizeText(product.slug);

  let score = 0;
  const matchedOn = new Set();

  if (normalizedQuery && title.includes(normalizedQuery)) {
    score += 120;
    matchedOn.add("title");
  }

  if (normalizedQuery && category.includes(normalizedQuery)) {
    score += 80;
    matchedOn.add("category");
  }

  if (normalizedQuery && brand.includes(normalizedQuery)) {
    score += 75;
    matchedOn.add("brand");
  }

  if (normalizedQuery && badge.includes(normalizedQuery)) {
    score += 60;
    matchedOn.add("badge");
  }

  for (const term of searchTerms) {
    const normalizedTerm = normalizeText(term);

    if (!normalizedTerm) {
      continue;
    }

    if (title.includes(normalizedTerm)) {
      score += 36;
      matchedOn.add("title");
    }

    if (category.includes(normalizedTerm)) {
      score += 28;
      matchedOn.add("category");
    }

    if (brand.includes(normalizedTerm)) {
      score += 24;
      matchedOn.add("brand");
    }

    if (badge.includes(normalizedTerm)) {
      score += 18;
      matchedOn.add("badge");
    }

    if (description.includes(normalizedTerm) || slug.includes(normalizedTerm)) {
      score += 12;
      matchedOn.add("description");
    }
  }

  for (const categoryHint of interpretation.categories) {
    if (includesTerm(product.category, categoryHint)) {
      score += 42;
      matchedOn.add("category");
    }
  }

  for (const brandHint of interpretation.brands) {
    if (includesTerm(product.brand, brandHint)) {
      score += 38;
      matchedOn.add("brand");
    }
  }

  for (const badgeHint of interpretation.badges) {
    if (includesTerm(product.badge, badgeHint)) {
      score += 32;
      matchedOn.add("badge");
    }
  }

  const rawTokens = tokenize(query);
  if (rawTokens.length && rawTokens.every((token) => title.includes(token) || description.includes(token))) {
    score += 40;
  }

  return {
    score,
    matchedOn: [...matchedOn],
  };
}

export async function findProductsBySmartSearch(query) {
  const trimmedQuery = String(query || "").trim();

  if (!trimmedQuery) {
    return {
      items: [],
      meta: {
        query: "",
        total: 0,
        usedAI: false,
        interpreted: null,
      },
    };
  }

  const products = await Product.find().lean();
  const categories = uniqueStrings(products.map((product) => product.category));
  const brands = uniqueStrings(products.map((product) => product.brand));
  const badges = uniqueStrings(products.map((product) => product.badge));
  const titles = uniqueStrings(products.map((product) => product.title));

  const interpretation = await interpretProductSearch({
    query: trimmedQuery,
    categories,
    brands,
    badges,
    titles,
  });

  const searchTerms = buildSearchTerms(trimmedQuery, interpretation);

  const scoredProducts = products
    .map((product) => {
      const result = scoreProduct(product, trimmedQuery, interpretation, searchTerms);
      return {
        product,
        ...result,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (Boolean(right.product.featured) !== Boolean(left.product.featured)) {
        return Number(Boolean(right.product.featured)) - Number(Boolean(left.product.featured));
      }

      if ((right.product.rating || 0) !== (left.product.rating || 0)) {
        return (right.product.rating || 0) - (left.product.rating || 0);
      }

      return left.product.title.localeCompare(right.product.title);
    });

  return {
    items: scoredProducts,
    meta: {
      query: trimmedQuery,
      total: scoredProducts.length,
      usedAI: Boolean(interpretation.usedAI),
      interpreted: {
        normalizedQuery: interpretation.normalizedQuery || trimmedQuery,
        keywords: uniqueStrings([
          ...interpretation.keywords,
          ...interpretation.productTypes,
        ]),
        categories: uniqueStrings(interpretation.categories),
        brands: uniqueStrings(interpretation.brands),
        badges: uniqueStrings(interpretation.badges),
      },
    },
  };
}
