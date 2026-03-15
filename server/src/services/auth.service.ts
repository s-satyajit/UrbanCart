import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { Cart } from "../models/Cart.js";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { Wishlist } from "../models/Wishlist.js";
import { conflictError, unauthorizedError } from "../middleware/error-handler.js";
import { createSessionToken } from "../utils/session-token.js";

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
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw conflictError("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
  });

  await Promise.all([
    Cart.create({ user: user._id, items: [] }),
    Wishlist.create({ user: user._id, items: [] }),
  ]);

  return user;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw unauthorizedError("Invalid email or password.");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw unauthorizedError("Invalid email or password.");
  }

  return user;
}

