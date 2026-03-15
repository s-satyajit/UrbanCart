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
      <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 text-center sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-50">Wishlist is empty</h1>
        <p className="mt-3 text-slate-400">Save products to compare them later.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-full bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
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
          className="flex flex-col gap-5 rounded-[28px] border border-slate-800 bg-slate-900/70 p-5 lg:flex-row"
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
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
                onClick={() => addToCart(product, 1)}
              >
                Move to cart
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-950"
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
