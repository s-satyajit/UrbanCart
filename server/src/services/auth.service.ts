import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { Cart } from "../models/Cart.js";
import { RegistrationOtp } from "../models/RegistrationOtp.js";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { Wishlist } from "../models/Wishlist.js";
import {
  badRequestError,
  conflictError,
  unauthorizedError,
} from "../middleware/error-handler.js";
import { sendRegistrationOtp } from "./mail.service.js";
import { createSessionToken } from "../utils/session-token.js";

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function createOtpCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function compareOtp(otp, otpHash) {
  const expected = Buffer.from(otpHash, "hex");
  const candidate = Buffer.from(hashOtp(otp), "hex");

  if (expected.length !== candidate.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, candidate);
}

async function createUserAccount(payload) {
  try {
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
    });

    await Promise.all([
      Cart.create({ user: user._id, items: [] }),
      Wishlist.create({ user: user._id, items: [] }),
    ]);

    return user;
  } catch (error) {
    if (error?.code === 11000) {
      throw conflictError("An account with this email already exists.");
    }

    throw error;
  }
}

export async function createUserSession(user) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000);

  const session = await Session.create({
    user: user._id,
    token,
    expiresAt,
  });

  return { token: session.token, expiresAt: session.expiresAt };
}

export async function registerUser(payload) {
  const email = normalizeEmail(payload.email);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw conflictError("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  return createUserAccount({
    name: payload.name.trim(),
    email,
    passwordHash,
  });
}

export async function requestRegistrationOtp(payload) {
  const name = payload.name?.trim();
  const email = normalizeEmail(payload.email);
  const password = payload.password || "";

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw conflictError("An account with this email already exists.");
  }

  const otp = createOtpCode();
  const expiresAt = new Date(
    Date.now() + env.registrationOtpExpiryMinutes * 60 * 1000
  );
  const passwordHash = await bcrypt.hash(password, 10);

  await RegistrationOtp.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        email,
        passwordHash,
        otpHash: hashOtp(otp),
        attempts: 0,
        expiresAt,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const sent = await sendRegistrationOtp({
    name,
    email,
    otp,
    expiresInMinutes: env.registrationOtpExpiryMinutes,
  });

  if (!sent.sent) {
    throw badRequestError(
      `Could not send OTP email. ${sent.message}`
    );
  }

  return {
    email,
    expiresAt,
  };
}

export async function verifyRegistrationOtp(payload) {
  const email = normalizeEmail(payload.email);
  const otp = (payload.otp || "").trim();
  const pendingRegistration = await RegistrationOtp.findOne({ email });

  if (!pendingRegistration) {
    throw badRequestError("No pending registration found for this email.");
  }

  if (!otp) {
    throw badRequestError("OTP is required.");
  }

  if (pendingRegistration.expiresAt.getTime() <= Date.now()) {
    await RegistrationOtp.deleteOne({ _id: pendingRegistration._id });
    throw unauthorizedError("OTP expired. Please request a new one.");
  }

  if (pendingRegistration.attempts >= env.registrationOtpMaxAttempts) {
    await RegistrationOtp.deleteOne({ _id: pendingRegistration._id });
    throw unauthorizedError("Too many invalid OTP attempts. Request a new OTP.");
  }

  const isValidOtp = compareOtp(otp, pendingRegistration.otpHash);

  if (!isValidOtp) {
    pendingRegistration.attempts += 1;

    if (pendingRegistration.attempts >= env.registrationOtpMaxAttempts) {
      await RegistrationOtp.deleteOne({ _id: pendingRegistration._id });
      throw unauthorizedError("Too many invalid OTP attempts. Request a new OTP.");
    }

    await pendingRegistration.save();
    throw unauthorizedError("Invalid OTP.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    await RegistrationOtp.deleteOne({ _id: pendingRegistration._id });
    throw conflictError("An account with this email already exists.");
  }

  const user = await createUserAccount({
    name: pendingRegistration.name,
    email: pendingRegistration.email,
    passwordHash: pendingRegistration.passwordHash,
  });

  await RegistrationOtp.deleteOne({ _id: pendingRegistration._id });
  return user;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user) {
    throw unauthorizedError("Invalid email or password.");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw unauthorizedError("Invalid email or password.");
  }

  return user;
}
