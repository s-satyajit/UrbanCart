import { useContext } from "react";
import AuthPrompt from "../components/AuthPrompt";
import { ProductContext } from "../contexts/product-context";

const Orders = () => {
  const { isAuthenticated, orders } = useContext(ProductContext);

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        title="Sign in to track orders"
        description="Orders are created at checkout and stored on the backend."
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Orders</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-50">Track order activity</h1>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-8 text-slate-400">
          No orders yet. Checkout your cart to create the first order.
        </div>
      ) : null}
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-50">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-slate-400">
                Placed on {new Date(order.placedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200">
              {order.status}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-400">
            <span>{order.items.reduce((total, item) => total + item.quantity, 0)} items</span>
            <span>Total: INR {Number(order.totalAmount).toFixed(2)}</span>
            <span>Payment: {order.payment?.status || "created"}</span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Orders;
