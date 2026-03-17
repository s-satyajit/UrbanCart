import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/product-context";

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    brand?: string;
    badge?: string;
    image: string;
    rating: {
      rate: number;
      count?: number;
    };
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
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
    <article className="surface-panel group flex h-full flex-col overflow-hidden rounded-[28px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(5,12,30,0.45)]">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="surface-chip absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium">
          {product.category}
        </div>
        <div className="btn-primary absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-slate-950">
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
          <span className="surface-chip rounded-full px-2 py-1 text-xs">
            {product.rating.rate.toFixed(1)} rating
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
          {product.description}
        </p>

        <div className="surface-panel-soft mt-5 flex items-center justify-between rounded-2xl p-2">
          <button
            type="button"
            className="btn-secondary h-10 w-10 rounded-xl text-lg"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            -
          </button>
          <span className="text-sm font-medium text-slate-100">{quantity}</span>
          <button
            type="button"
            className="btn-secondary h-10 w-10 rounded-xl text-lg"
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
            className="btn-primary flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to cart
          </button>
          <button
            type="button"
            disabled={isBusy || isWishlistItem}
            onClick={() => handleAction(() => addToWishlist(product.id))}
            className="btn-secondary rounded-2xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
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
