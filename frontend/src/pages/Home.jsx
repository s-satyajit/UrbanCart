import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../contexts/product-context";

const Home = () => {
  const { loading, storefront, summary } = useContext(ProductContext);

  if (loading || !storefront) {
    return (
      <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-300">
        Loading storefront...
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[36px] border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(17,24,39,0.96))] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Storefront</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
            {storefront.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {storefront.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
            >
              Shop products
            </Link>
            <Link
              to="/profile"
              className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            >
              View profile
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live stats</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Cart items</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.cartCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Wishlist</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.wishlistCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Orders</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.ordersCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Featured</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-50">Featured products</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            A curated selection from the live catalog with backend-connected cart and
            wishlist actions.
          </p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
          {storefront.featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
