import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function isSmtpConfigured() {
  return Boolean(
    env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass
  );
}

function getMissingSmtpConfig() {
  const missing = [];

  if (!env.smtpHost) {
    missing.push("SMTP_HOST");
  }
  if (!env.smtpPort) {
    missing.push("SMTP_PORT");
  }
  if (!env.smtpUser) {
    missing.push("SMTP_USER");
  }
  if (!env.smtpPass) {
    missing.push("SMTP_PASS");
  }

  return missing;
}

function isContactNotificationConfigured() {
  return Boolean(isSmtpConfigured() && env.contactNotificationTo);
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return transporter;
}

function normalizeSmtpErrorMessage(error: unknown) {
  const rawMessage =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: string }).message || "")
      : "";

  if (/5\.7\.139|basic authentication is disabled/i.test(rawMessage)) {
    return "Microsoft SMTP auth is blocked for this mailbox. Enable Authenticated SMTP in Microsoft account settings, or use an app password-enabled mailbox.";
  }

  if (/invalid login|eauth/i.test(rawMessage)) {
    return "SMTP authentication failed. Check SMTP_USER and SMTP_PASS.";
  }

  return (
    rawMessage || "SMTP authentication failed or mail server rejected the request."
  );
}

export async function sendContactNotification(contactMessage) {
  if (!isContactNotificationConfigured()) {
    return false;
  }

  try {
    await getTransporter().sendMail({
      from: env.contactNotificationFrom || env.smtpUser,
      to: env.contactNotificationTo,
      replyTo: `${contactMessage.name} <${contactMessage.email}>`,
      subject: `New Urban Cart contact: ${contactMessage.subject}`,
      text: [
        "A new contact form submission was received.",
        "",
        `Name: ${contactMessage.name}`,
        `Email: ${contactMessage.email}`,
        `Subject: ${contactMessage.subject}`,
        "",
        "How can we help:",
        contactMessage.howCanWeHelp,
      ].join("\n"),
    });

    return true;
  } catch (error) {
    console.error("Contact notification email failed:", error);
    return false;
  }
}

export async function sendRegistrationOtp(payload) {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      message: `Missing SMTP config: ${getMissingSmtpConfig().join(", ")}`,
    };
  }

  try {
    await getTransporter().sendMail({
      from: env.contactNotificationFrom || env.smtpUser,
      to: payload.email,
      subject: "Urban Cart verification code",
      text: [
        `Hi ${payload.name},`,
        "",
        `Your Urban Cart verification code is: ${payload.otp}`,
        "",
        `This code expires in ${payload.expiresInMinutes} minutes.`,
        "If you did not request this, you can ignore this email.",
      ].join("\n"),
    });

    return { sent: true, message: "" };
  } catch (error) {
    console.error("Registration OTP email failed:", error);
    return {
      sent: false,
      message: normalizeSmtpErrorMessage(error),
    };
  }
}

