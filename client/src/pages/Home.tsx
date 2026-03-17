import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../contexts/product-context";

const Home = () => {
  const { loading, storefront, summary } = useContext(ProductContext);

  if (loading || !storefront) {
    return (
      <div className="surface-panel rounded-[28px] p-10 text-center text-slate-300">
        Loading storefront...
      </div>
    );
  }

  return (
    <section className="space-y-8 reveal-up">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-panel rounded-[36px] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Storefront</p>
          <h1 className="brand-font mt-4 max-w-4xl text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl lg:text-5xl">
            {storefront.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {storefront.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="btn-primary rounded-full px-5 py-3 font-semibold text-slate-950"
            >
              Shop products
            </Link>
            <Link
              to="/profile"
              className="btn-secondary rounded-full px-5 py-3 font-semibold"
            >
              View profile
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="surface-panel rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live stats</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="surface-panel-soft rounded-2xl p-4">
                <p className="text-sm text-slate-400">Cart items</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.cartCount}</p>
              </div>
              <div className="surface-panel-soft rounded-2xl p-4">
                <p className="text-sm text-slate-400">Wishlist</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.wishlistCount}</p>
              </div>
              <div className="surface-panel-soft rounded-2xl p-4">
                <p className="text-sm text-slate-400">Orders</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.ordersCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-panel rounded-[32px] p-8 sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Featured</p>
            <h2 className="brand-font mt-3 text-3xl font-semibold text-slate-50">Featured products</h2>
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
