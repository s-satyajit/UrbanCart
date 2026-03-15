import { navigationLinks } from "../constants/site-content.ts";

export function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    initials: user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join(""),
  };
}

export function serializeProduct(product) {
  return {
    id: product._id.toString(),
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    brand: product.brand,
    image: product.image,
    gallery: product.gallery,
    rating: {
      rate: product.rating,
      count: product.stock,
    },
    badge: product.badge,
    featured: product.featured,
  };
}

export function serializeCart(cart) {
  return cart.items
    .filter((item) => item.product)
    .map((item) => ({
      ...serializeProduct(item.product),
      quantity: item.quantity,
      lineTotal: Number((item.product.price * item.quantity).toFixed(2)),
    }));
}

export function serializeWishlist(wishlist) {
  return wishlist.items.filter(Boolean).map((product) => serializeProduct(product));
}

export function serializeOrder(order) {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    placedAt: order.placedAt,
    totalAmount: order.totalAmount,
    items: order.items,
    payment: {
      provider: order.payment?.provider || "razorpay",
      status: order.payment?.status || "created",
      currency: order.payment?.currency || "INR",
      razorpayOrderId: order.payment?.razorpayOrderId || "",
      razorpayPaymentId: order.payment?.razorpayPaymentId || "",
      paidAt: order.payment?.paidAt || null,
    },
  };
}

export function buildNavigation() {
  return navigationLinks;
}
