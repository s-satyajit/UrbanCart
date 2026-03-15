import { Cart } from "../models/Cart.ts";
import { Order } from "../models/Order.ts";
import { Wishlist } from "../models/Wishlist.ts";
import { serializeCart } from "../utils/serializers.ts";

export async function ensureUserResources(userId) {
  const [cart, wishlist] = await Promise.all([
    Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, items: [] } },
      { upsert: true, new: true }
    ),
    Wishlist.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, items: [] } },
      { upsert: true, new: true }
    ),
  ]);

  return { cart, wishlist };
}

export async function getUserSummary(userId) {
  const [cart, wishlist, ordersCount] = await Promise.all([
    Cart.findOne({ user: userId }).populate("items.product"),
    Wishlist.findOne({ user: userId }),
    Order.countDocuments({ user: userId }),
  ]);

  const cartItems = cart ? serializeCart(cart) : [];
  const cartTotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);

  return {
    cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: Number(cartTotal.toFixed(2)),
    wishlistCount: wishlist?.items?.length || 0,
    ordersCount,
  };
}
