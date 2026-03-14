import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.env" });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task-eleven-store",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
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
