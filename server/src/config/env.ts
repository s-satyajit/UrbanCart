import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const envFilePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".env");
dotenv.config({ path: envFilePath });

const nodeEnv = process.env.NODE_ENV || "development";
const mongoUri = process.env.MONGODB_URI?.trim();
const clientUrl = process.env.CLIENT_URL?.trim();

if (nodeEnv === "production" && !mongoUri) {
  throw new Error("Missing MONGODB_URI in production environment.");
}

if (nodeEnv === "production" && !clientUrl) {
  throw new Error("Missing CLIENT_URL in production environment.");
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT),
  mongoUri: mongoUri,
  clientUrl: clientUrl,
  clientUrls: (clientUrl)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS) || 24,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  razorpayCurrency: process.env.RAZORPAY_CURRENCY || "INR",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  contactNotificationTo: process.env.CONTACT_NOTIFICATION_TO || "",
  contactNotificationFrom: process.env.CONTACT_NOTIFICATION_FROM || "",
};
