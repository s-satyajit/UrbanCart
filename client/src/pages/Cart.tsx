import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthPrompt from "../components/AuthPrompt";
import { ProductContext } from "../contexts/product-context";

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Cart = () => {
  const {
    busyAction,
    cart,
    createCheckoutSession,
    isAuthenticated,
    removeFromCart,
    summary,
    updateCartItem,
    verifyCheckoutPayment,
  } = useContext(ProductContext);
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    try {
      setMessage("");
      const isRazorpayLoaded = await loadRazorpayScript();

      if (!isRazorpayLoaded) {
        throw new Error("Could not load Razorpay Checkout.");
      }

      const checkout = await createCheckoutSession();

      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Urban Cart",
        description: `Payment for ${checkout.orderNumber}`,
        order_id: checkout.razorpayOrderId,
        prefill: {
          name: checkout.customer.name,
          email: checkout.customer.email,
          contact: checkout.customer.contact,
        },
        theme: {
          color: "#dfe4ea",
        },
        handler: async (response) => {
          try {
            const order = await verifyCheckoutPayment({
              appOrderId: checkout.appOrderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setMessage(`Payment successful. ${order.orderNumber} is now paid.`);
          } catch (error) {
            setMessage(error.message);
          }
        },
        modal: {
          ondismiss: () => {
            setMessage("Payment was cancelled before completion.");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        setMessage(
          response.error?.description || "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        title="Sign in to manage your cart"
        description="Cart items are stored in MongoDB and linked to your account."
      />
    );
  }

  if (cart.length === 0) {
    return (
      <section className="surface-panel rounded-[32px] p-8 text-center sm:p-10">
        <h1 className="brand-font text-3xl font-semibold text-slate-50">Your cart is empty</h1>
        <p className="mt-3 text-slate-400">
          Add products from the catalog and they will show up here instantly.
        </p>
        <Link
          to="/products"
          className="btn-primary mt-6 inline-flex rounded-full px-5 py-3 font-semibold text-slate-950"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
      <div className="space-y-4">
        {cart.map((product) => (
          <article
            key={product.id}
            className="surface-panel flex flex-col gap-5 rounded-[28px] p-5 lg:flex-row"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-36 w-full rounded-[20px] object-cover sm:h-44 lg:h-36 lg:w-36"
            />
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-semibold text-slate-50">{product.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {product.description}
                  </p>
                </div>
                <p className="text-lg font-semibold text-slate-100">INR {product.price}</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="btn-secondary h-10 w-10 rounded-xl"
                    onClick={() => updateCartItem(product.id, product.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="min-w-10 text-center text-slate-100">
                    {product.quantity}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary h-10 w-10 rounded-xl"
                    onClick={() => updateCartItem(product.id, product.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn-secondary rounded-full px-4 py-2 text-sm"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="text-sm text-slate-400">
                  Line total: INR {product.lineTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="surface-panel h-fit rounded-[28px] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Summary</p>
        <h2 className="brand-font mt-3 text-3xl font-semibold text-slate-50">Checkout</h2>
        <div className="mt-6 space-y-3 text-sm text-slate-400">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span>{summary.cartCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span>INR {summary.cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={busyAction === "checkout" || busyAction === "checkout-verify"}
          className="btn-primary mt-6 w-full rounded-2xl px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === "checkout"
            ? "Opening Razorpay..."
            : busyAction === "checkout-verify"
              ? "Verifying payment..."
              : "Pay with Razorpay"}
        </button>
        {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
      </aside>
    </section>
  );
};

export default Cart;
