import { asyncHandler } from "../middleware/async-handler.js";
import { env } from "../config/env.js";
import { badRequestError, notFoundError } from "../middleware/error-handler.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { ensureUserResources, getUserSummary } from "../services/account.service.js";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../services/payment.service.js";
import { serializeOrder } from "../utils/serializers.js";

export const getOrders = asyncHandler(async (req, res) => {
  await ensureUserResources(req.auth.user._id);
  const orders = await Order.find({ user: req.auth.user._id }).sort({ createdAt: -1 });
  const summary = await getUserSummary(req.auth.user._id);
  res.json({ items: orders.map((order) => serializeOrder(order)), summary });
});

function mapCartItems(cart) {
  return cart.items
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product._id,
      title: item.product.title,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));
}

export const checkout = asyncHandler(async (req, res) => {
  await ensureUserResources(req.auth.user._id);
  const cart = await Cart.findOne({ user: req.auth.user._id }).populate("items.product");

  if (!cart.items.length) {
    throw badRequestError("Your cart is empty.");
  }

  const items = mapCartItems(cart);

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const amountInSubunits = Math.round(Number(totalAmount.toFixed(2)) * 100);
  const orderNumber = `UC-${Date.now()}`;

  const order = await Order.create({
    user: req.auth.user._id,
    orderNumber,
    status: "Pending Payment",
    items,
    totalAmount: Number(totalAmount.toFixed(2)),
    shippingAddress: req.auth.user.address,
    payment: {
      provider: "razorpay",
      status: "created",
      currency: env.razorpayCurrency,
      amountInSubunits,
    },
    placedAt: new Date(),
  });

  const razorpayOrder = await createRazorpayOrder({
    amountInSubunits,
    receipt: orderNumber.slice(0, 40),
    notes: {
      appOrderId: order._id.toString(),
      orderNumber,
      userId: req.auth.user._id.toString(),
    },
  });

  order.payment.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    checkout: {
      keyId: env.razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      appOrderId: order._id.toString(),
      orderNumber: order.orderNumber,
      customer: {
        name: req.auth.user.name,
        email: req.auth.user.email,
        contact: req.auth.user.phone || "",
      },
    },
  });
});

export const verifyCheckoutPayment = asyncHandler(async (req, res) => {
  await ensureUserResources(req.auth.user._id);
  const {
    appOrderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (!appOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw badRequestError("Payment verification payload is incomplete.");
  }

  const order = await Order.findOne({
    _id: appOrderId,
    user: req.auth.user._id,
  });

  if (!order) {
    throw notFoundError("Order not found for payment verification.");
  }

  if (order.payment?.razorpayOrderId !== razorpayOrderId) {
    throw badRequestError("Razorpay order mismatch.");
  }

  const isValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    order.payment.status = "failed";
    await order.save();
    throw badRequestError("Razorpay signature verification failed.");
  }

  order.status = "Paid";
  order.payment.status = "paid";
  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.payment.razorpaySignature = razorpaySignature;
  order.payment.paidAt = new Date();
  order.placedAt = new Date();
  await order.save();

  const cart = await Cart.findOne({ user: req.auth.user._id });
  cart.set("items", []);
  await cart.save();

  const summary = await getUserSummary(req.auth.user._id);
  const orders = await Order.find({ user: req.auth.user._id }).sort({ createdAt: -1 });

  res.json({
    message: "Payment verified and order placed successfully.",
    order: serializeOrder(order),
    items: orders.map((entry) => serializeOrder(entry)),
    summary,
  });
});

