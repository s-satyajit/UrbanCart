import { asyncHandler } from "../middleware/async-handler.js";
import { badRequestError, notFoundError } from "../middleware/error-handler.js";
import { Product } from "../models/Product.js";
import { Wishlist } from "../models/Wishlist.js";
import { ensureUserResources, getUserSummary } from "../services/account.service.js";
import { serializeWishlist } from "../utils/serializers.js";
async function getPopulatedWishlist(userId) {
    return Wishlist.findOne({ user: userId }).populate("items");
}
export const getWishlist = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const wishlist = await getPopulatedWishlist(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.json({ items: serializeWishlist(wishlist), summary });
});
export const addWishlistItem = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const { productId } = req.body;
    if (!productId) {
        throw badRequestError("Product is required.");
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw notFoundError("Product not found.");
    }
    const wishlist = await Wishlist.findOne({ user: req.auth.user._id });
    const exists = wishlist.items.some((item) => item.toString() === productId.toString());
    if (!exists) {
        wishlist.items.push(product._id);
        await wishlist.save();
    }
    const populatedWishlist = await getPopulatedWishlist(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.status(201).json({ items: serializeWishlist(populatedWishlist), summary });
});
export const removeWishlistItem = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const wishlist = await Wishlist.findOne({ user: req.auth.user._id });
    wishlist.items = wishlist.items.filter((item) => item.toString() !== req.params.productId.toString());
    await wishlist.save();
    const populatedWishlist = await getPopulatedWishlist(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.json({ items: serializeWishlist(populatedWishlist), summary });
});
