import { asyncHandler } from "../middleware/async-handler.js";
import { ensureUserResources, getUserSummary } from "../services/account.service.js";
import { serializeUser } from "../utils/serializers.js";

export const getProfile = asyncHandler(async (req, res) => {
  await ensureUserResources(req.auth.user._id);
  const summary = await getUserSummary(req.auth.user._id);

  res.json({
    profile: serializeUser(req.auth.user),
    summary,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  await ensureUserResources(req.auth.user._id);
  const { name, phone, address } = req.body;

  if (name) {
    req.auth.user.name = name;
  }

  if (typeof phone === "string") {
    req.auth.user.phone = phone;
  }

  if (address) {
    req.auth.user.address = {
      ...req.auth.user.address.toObject(),
      ...address,
    };
  }

  await req.auth.user.save();
  const summary = await getUserSummary(req.auth.user._id);

  res.json({
    profile: serializeUser(req.auth.user),
    summary,
    message: "Profile updated successfully.",
  });
});
