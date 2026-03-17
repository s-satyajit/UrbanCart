import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthPrompt from "../components/AuthPrompt";
import { ProductContext } from "../contexts/product-context";

const Wishlist = () => {
  const { addToCart, isAuthenticated, removeFromWishlist, wishlist } =
    useContext(ProductContext);

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        title="Sign in to save favorites"
        description="Wishlist items are connected to your account and available on every session."
      />
    );
  }

  if (wishlist.length === 0) {
    return (
      <section className="surface-panel rounded-[32px] p-8 text-center sm:p-10">
        <h1 className="brand-font text-3xl font-semibold text-slate-50">Wishlist is empty</h1>
        <p className="mt-3 text-slate-400">Save products to compare them later.</p>
        <Link
          to="/products"
          className="btn-primary mt-6 inline-flex rounded-full px-5 py-3 font-semibold text-slate-950"
        >
          Explore products
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {wishlist.map((product) => (
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
                <p className="mt-2 text-sm leading-7 text-slate-400">{product.description}</p>
              </div>
              <p className="text-lg font-semibold text-slate-100">INR {product.price}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary rounded-full px-4 py-2 text-sm font-semibold text-slate-950"
                onClick={() => addToCart(product, 1)}
              >
                Move to cart
              </button>
              <button
                type="button"
                className="btn-secondary rounded-full px-4 py-2 text-sm"
                onClick={() => removeFromWishlist(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Wishlist;
