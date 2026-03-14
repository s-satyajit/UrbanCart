import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/product-context";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addToCart, addToWishlist, busyAction, isAuthenticated, wishlist } =
    useContext(ProductContext);

  const isWishlistItem = wishlist.some((item) => item.id === product.id);
  const isBusy =
    busyAction === `cart-${product.id}` || busyAction === `wishlist-${product.id}`;

  const handleAction = async (action) => {
    setMessage("");
    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }

    try {
      await action();
      setMessage("Updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/78 shadow-[0_20px_60px_rgba(2,6,23,0.28)]">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="h-56 w-full object-cover"
        />
        <div className="absolute left-4 top-4 rounded-full border border-slate-700 bg-slate-950/85 px-3 py-1 text-xs font-medium text-slate-200">
          {product.category}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-950">
          INR {product.price}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-50">{product.title}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
              {product.badge || product.brand}
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300">
            {product.rating.rate.toFixed(1)} rating
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-2">
          <button
            type="button"
            className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900 text-lg text-slate-100 transition hover:border-slate-600"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            -
          </button>
          <span className="text-sm font-medium text-slate-100">{quantity}</span>
          <button
            type="button"
            className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900 text-lg text-slate-100 transition hover:border-slate-600"
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleAction(() => addToCart(product, quantity))}
            className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to cart
          </button>
          <button
            type="button"
            disabled={isBusy || isWishlistItem}
            onClick={() => handleAction(() => addToWishlist(product.id))}
            className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isWishlistItem ? "Saved" : "Wishlist"}
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
      </div>
    </article>
  );
};

export default ProductCard;

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    brand: PropTypes.string,
    badge: PropTypes.string,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number,
    }).isRequired,
  }).isRequired,
};
