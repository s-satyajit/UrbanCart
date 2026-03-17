import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../contexts/product-context";

function renderChipGroup(label, items) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</span>
      {items.map((item) => (
        <span
          key={`${label}-${item}`}
          className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

const DisplayProducts = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() || "";
  const {
    clearCatalogSearch,
    error,
    loading,
    productSearch,
    products,
    searchCatalog,
  } = useContext(ProductContext);

  useEffect(() => {
    if (!searchQuery) {
      clearCatalogSearch();
      return;
    }

    void searchCatalog(searchQuery).catch(() => {});
  }, [clearCatalogSearch, searchCatalog, searchQuery]);

  if (loading) {
    return (
      <div className="surface-panel rounded-[28px] p-10 text-center text-slate-300">
        Loading products...
      </div>
    );
  }

  if (!searchQuery && error) {
    return (
      <div className="rounded-[28px] border border-red-900/60 bg-red-950/40 p-10 text-center text-red-100">
        {error}
      </div>
    );
  }

  const showingSearch = Boolean(searchQuery);
  const searchFailed = showingSearch && productSearch.error;
  const searching = showingSearch && productSearch.searching;
  const visibleProducts = showingSearch ? productSearch.items : products;
  const totalResults = showingSearch ? productSearch.total : products.length;

  return (
    <section className="space-y-8 reveal-up">
      <div className="surface-panel rounded-[32px] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Catalog</p>
        <h1 className="brand-font mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">
          {showingSearch ? "Search results" : "Explore the product collection"}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          {showingSearch
            ? `Showing ${totalResults} result${totalResults === 1 ? "" : "s"} for "${searchQuery}". Search understands names, keywords, categories, brands, and product references.`
            : "Every product card is connected to the backend so cart and wishlist actions update the app state immediately."}
        </p>

        {showingSearch && productSearch.interpreted ? (
          <div className="surface-panel-soft mt-6 space-y-3 rounded-[28px] p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="surface-chip rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">
                {productSearch.usedAI ? "AI Assisted" : "Keyword Search"}
              </span>
              <span>
                Understood as{" "}
                <span className="font-medium text-slate-100">
                  {productSearch.interpreted.normalizedQuery}
                </span>
              </span>
            </div>
            <div className="space-y-2">
              {renderChipGroup("Keywords", productSearch.interpreted.keywords)}
              {renderChipGroup("Categories", productSearch.interpreted.categories)}
              {renderChipGroup("Brands", productSearch.interpreted.brands)}
              {renderChipGroup("Badges", productSearch.interpreted.badges)}
            </div>
          </div>
        ) : null}
      </div>

      {searching ? (
        <div className="surface-panel rounded-[28px] p-10 text-center text-slate-300">
          Searching the catalog...
        </div>
      ) : null}

      {searchFailed ? (
        <div className="rounded-[28px] border border-red-900/60 bg-red-950/40 p-10 text-center text-red-100">
          {productSearch.error}
        </div>
      ) : null}

      {!searching && !searchFailed && !visibleProducts.length ? (
        <div className="surface-panel-soft rounded-[28px] border border-dashed p-10 text-center text-slate-400">
          No products matched this search yet. Try a broader phrase like category,
          brand, or product type.
        </div>
      ) : null}

      {!searching && !searchFailed && visibleProducts.length ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default DisplayProducts;
