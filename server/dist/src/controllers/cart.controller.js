import { asyncHandler } from "../middleware/async-handler.js";
import { badRequestError, notFoundError } from "../middleware/error-handler.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { ensureUserResources, getUserSummary } from "../services/account.service.js";
import { serializeCart } from "../utils/serializers.js";
async function getPopulatedCart(userId) {
    return Cart.findOne({ user: userId }).populate("items.product");
}
export const getCart = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const cart = await getPopulatedCart(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.json({ items: serializeCart(cart), summary });
});
export const addCartItem = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
        throw badRequestError("Product is required.");
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw notFoundError("Product not found.");
    }
    const cart = await Cart.findOne({ user: req.auth.user._id });
    const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());
    if (existingItem) {
        existingItem.quantity += Math.max(1, Number(quantity) || 1);
    }
    else {
        cart.items.push({ product: product._id, quantity: Math.max(1, Number(quantity) || 1) });
    }
    await cart.save();
    const populatedCart = await getPopulatedCart(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.status(201).json({ items: serializeCart(populatedCart), summary });
});
export const updateCartItem = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.auth.user._id });
    const item = cart.items.find((entry) => entry.product.toString() === req.params.productId.toString());
    if (!item) {
        throw notFoundError("Cart item not found.");
    }
    if (Number(quantity) <= 0) {
        cart.set("items", cart.items.filter((entry) => entry.product.toString() !== req.params.productId.toString()));
    }
    else {
        item.quantity = Number(quantity);
    }
    await cart.save();
    const populatedCart = await getPopulatedCart(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.json({ items: serializeCart(populatedCart), summary });
});
export const removeCartItem = asyncHandler(async (req, res) => {
    await ensureUserResources(req.auth.user._id);
    const cart = await Cart.findOne({ user: req.auth.user._id });
    cart.set("items", cart.items.filter((entry) => entry.product.toString() !== req.params.productId.toString()));
    await cart.save();
    const populatedCart = await getPopulatedCart(req.auth.user._id);
    const summary = await getUserSummary(req.auth.user._id);
    res.json({ items: serializeCart(populatedCart), summary });
});
