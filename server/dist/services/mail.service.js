import nodemailer from "nodemailer";
import { env } from "../config/env.js";
let transporter;
function isSmtpConfigured() {
    return Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass);
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
    }
    catch (error) {
        console.error("Contact notification email failed:", error);
        return false;
    }
}
export async function sendRegistrationOtp(payload) {
    if (!isSmtpConfigured()) {
        return false;
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
        return true;
    }
    catch (error) {
        console.error("Registration OTP email failed:", error);
        return false;
    }
}
