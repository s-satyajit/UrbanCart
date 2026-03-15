import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.ts";
import { badRequestError } from "../middleware/error-handler.ts";

let razorpayClient = null;

export function isRazorpayConfigured() {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret);
}

function getRazorpayClient() {
  if (!isRazorpayConfigured()) {
    throw badRequestError(
      "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }

  return razorpayClient;
}

export async function createRazorpayOrder({ amountInSubunits, receipt, notes }) {
  const razorpay = getRazorpayClient();

  return razorpay.orders.create({
    amount: amountInSubunits,
    currency: env.razorpayCurrency,
    receipt,
    notes,
  });
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!isRazorpayConfigured()) {
    throw badRequestError(
      "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`₹{razorpayOrderId}|₹{razorpayPaymentId}`)
    .digest("hex");

  return expectedSignature === razorpaySignature;
}
