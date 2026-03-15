import { asyncHandler } from "./async-handler.js";
import { Session } from "../models/Session.js";
function extractToken(req) {
    const header = req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
        return "";
    }
    return header.replace("Bearer ", "").trim();
}
export const optionalAuth = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        req.auth = { isAuthenticated: false, user: null, session: null };
        return next();
    }
    const session = await Session.findOne({ token }).populate("user");
    if (!session || session.expiresAt.getTime() <= Date.now()) {
        if (session) {
            await Session.deleteOne({ _id: session._id });
        }
        req.auth = { isAuthenticated: false, user: null, session: null };
        return next();
    }
    req.auth = {
        isAuthenticated: true,
        user: session.user,
        session,
    };
    return next();
});
export function requireAuth(req, res, next) {
    if (!req.auth?.isAuthenticated || !req.auth?.user) {
        return res.status(401).json({ message: "Please sign in to continue." });
    }
    return next();
}
