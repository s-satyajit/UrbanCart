import { contactChannels } from "../constants/site-content.ts";
import { asyncHandler } from "../middleware/async-handler.ts";
import { badRequestError } from "../middleware/error-handler.ts";
import { ContactMessage } from "../models/ContactMessage.ts";
import {
  createContactDraft,
  isGeminiConfigured,
} from "../services/gemini.service.ts";
import { sendContactNotification } from "../services/mail.service.ts";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateEmail(email) {
  return emailPattern.test(email);
}

function serializeContactMessage(contactMessage) {
  const item =
    typeof contactMessage.toObject === "function"
      ? contactMessage.toObject()
      : contactMessage;

  const howCanWeHelp = item.howCanWeHelp || item.message || "";

  return {
    id: item._id?.toString?.() || item.id || "",
    _id: item._id,
    name: item.name,
    email: item.email,
    subject: item.subject,
    howCanWeHelp,
    message: howCanWeHelp,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function validateContactPayload(payload) {
  const normalized = {
    name: normalizeValue(payload.name),
    email: normalizeValue(payload.email).toLowerCase(),
    subject: normalizeValue(payload.subject),
    howCanWeHelp: normalizeValue(payload.howCanWeHelp || payload.message),
  };

  if (!normalized.name || normalized.name.length < 2) {
    throw badRequestError("Please enter your name.");
  }

  if (!normalized.email || !validateEmail(normalized.email)) {
    throw badRequestError("Please enter a valid email address.");
  }

  if (!normalized.subject || normalized.subject.length < 3) {
    throw badRequestError("Please enter a subject.");
  }

  if (!normalized.howCanWeHelp || normalized.howCanWeHelp.length < 10) {
    throw badRequestError("Please tell us how we can help in a bit more detail.");
  }

  if (normalized.subject.length > 140) {
    throw badRequestError("Please keep the subject under 140 characters.");
  }

  if (normalized.howCanWeHelp.length > 3000) {
    throw badRequestError("Please keep your message under 3000 characters.");
  }

  return normalized;
}

async function getRecentMessagesForRequest(req) {
  if (!req.auth?.isAuthenticated) {
    return [];
  }

  const recentMessages = await ContactMessage.find({ user: req.auth.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return recentMessages.map(serializeContactMessage);
}

export const getContact = asyncHandler(async (req, res) => {
  const recentMessages = await getRecentMessagesForRequest(req);

  res.json({
    channels: contactChannels,
    recentMessages,
    ai: {
      enabled: isGeminiConfigured(),
    },
  });
});

export const createContactMessage = asyncHandler(async (req, res) => {
  const payload = validateContactPayload({
    name: req.body?.name || req.auth?.user?.name || "",
    email: req.body?.email || req.auth?.user?.email || "",
    subject: req.body?.subject || "",
    howCanWeHelp: req.body?.howCanWeHelp || req.body?.message || "",
  });

  const savedMessage = await ContactMessage.create({
    user: req.auth?.user?._id || null,
    ...payload,
    message: payload.howCanWeHelp,
  });

  const notificationSent = await sendContactNotification(payload);
  const recentMessages = await getRecentMessagesForRequest(req);

  res.status(201).json({
    message: "Your message has been sent.",
    contact: serializeContactMessage(savedMessage),
    recentMessages,
    notificationSent,
  });
});

export const createContactAIDraft = asyncHandler(async (req, res) => {
  const name = normalizeValue(req.body?.name || req.auth?.user?.name || "");
  const email = normalizeValue(req.body?.email || req.auth?.user?.email || "").toLowerCase();
  const prompt = normalizeValue(req.body?.prompt || "");

  if (!name || name.length < 2) {
    throw badRequestError("Please enter your name before using Write with AI.");
  }

  if (!email || !validateEmail(email)) {
    throw badRequestError("Please enter a valid email before using Write with AI.");
  }

  if (!prompt || prompt.length < 6) {
    throw badRequestError("Please add a short prompt so AI knows what to write.");
  }

  if (prompt.length > 1000) {
    throw badRequestError("Please keep the AI prompt under 1000 characters.");
  }

  const draft = await createContactDraft({
    name,
    email,
    prompt,
    channels: contactChannels,
  });

  res.json(draft);
});
