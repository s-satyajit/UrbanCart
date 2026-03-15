import { asyncHandler } from "../middleware/async-handler.js";
import { badRequestError } from "../middleware/error-handler.js";
import { Session } from "../models/Session.js";
import { createUserSession, loginUser, registerUser } from "../services/auth.service.js";
import { ensureUserResources, getUserSummary } from "../services/account.service.js";
import { buildNavigation, serializeUser } from "../utils/serializers.js";
function buildSessionPayload({ user, token = "", expiresAt = null, summary }) {
    return {
        authenticated: Boolean(user),
        token,
        expiresAt,
        user: serializeUser(user),
        summary,
        navigation: buildNavigation(),
    };
}
export const getSession = asyncHandler(async (req, res) => {
    if (!req.auth?.isAuthenticated || !req.auth.user) {
        return res.json(buildSessionPayload({
            user: null,
            summary: {
                cartCount: 0,
                cartTotal: 0,
                wishlistCount: 0,
                ordersCount: 0,
            },
        }));
    }
    await ensureUserResources(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    return res.json(buildSessionPayload({
        user: req.auth.user,
        token: req.auth.session.token,
        expiresAt: req.auth.session.expiresAt,
        summary,
    }));
});
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw badRequestError("Name, email, and password are required.");
    }
    const user = await registerUser({ name, email, password });
    const session = await createUserSession(user);
    const summary = await getUserSummary(user._id);
    res.status(201).json(buildSessionPayload({
        user,
        token: session.token,
        expiresAt: session.expiresAt,
        summary,
    }));
});
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw badRequestError("Email and password are required.");
    }
    const user = await loginUser(email, password);
    await ensureUserResources(user._id);
    const session = await createUserSession(user);
    const summary = await getUserSummary(user._id);
    res.json(buildSessionPayload({
        user,
        token: session.token,
        expiresAt: session.expiresAt,
        summary,
    }));
});
export const logout = asyncHandler(async (req, res) => {
    if (req.auth?.session?._id) {
        await Session.deleteOne({ _id: req.auth.session._id });
    }
    res.json({ message: "Signed out successfully." });
});
