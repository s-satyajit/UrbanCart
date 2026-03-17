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
      <div className="surface-panel rounded-[32px] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Orders</p>
        <h1 className="brand-font mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">Track order activity</h1>
      </div>
      {orders.length === 0 ? (
        <div className="surface-panel rounded-[28px] p-8 text-slate-400">
          No orders yet. Checkout your cart to create the first order.
        </div>
      ) : null}
      {orders.map((order) => (
        <article
          key={order.id}
          className="surface-panel rounded-[28px] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-50">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-slate-400">
                Placed on {new Date(order.placedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="surface-chip rounded-full px-4 py-2 text-sm">
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
