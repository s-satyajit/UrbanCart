import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/product-context";

const fallbackNavigation = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Orders", to: "/orders" },
  { label: "Profile", to: "/profile" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { busyAction, isAuthenticated, session, summary } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = session.navigation?.length
    ? session.navigation
    : fallbackNavigation;
  const displayName = session.user?.name || "Guest";
  const displayEmail = session.user?.email || "Browse the catalog";
  const initials =
    session.user?.initials ||
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  useEffect(() => {
    if (location.pathname !== "/products") {
      return;
    }

    const nextSearch = new URLSearchParams(location.search).get("search") || "";
    setSearchQuery(nextSearch);
  }, [location.pathname, location.search]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-100 text-sm font-semibold text-slate-950">
                UC
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">
                  Urban Cart
                </p>
                <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                  Hello, {displayName}
                </h1>
              </div>
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="min-w-0 flex-1 rounded-[28px] border border-slate-800 bg-slate-900/80 p-3"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                    Search Catalog
                  </p>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by product name, keyword, category, brand, or type"
                    className="mt-2 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busyAction === "product-search"}
                  className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyAction === "product-search" ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-slate-800 bg-slate-900/75 px-4 py-2 text-sm text-slate-300">
              Cart {summary.cartCount}
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-900/75 px-4 py-2 text-sm text-slate-300">
              Wishlist {summary.wishlistCount}
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-900/75 px-4 py-2 text-sm text-slate-300">
              Orders {summary.ordersCount}
            </div>
            {isAuthenticated ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-left transition hover:border-slate-700"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-950">
                    {initials || "G"}
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block truncate text-sm font-medium text-slate-100">
                      {displayName} signed in
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {displayEmail}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">{menuOpen ? "▲" : "▼"}</span>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-72 rounded-[24px] border border-slate-800 bg-slate-950 p-3 shadow-2xl">
                    <div className="rounded-[18px] bg-slate-900 px-4 py-3">
                      <p className="text-sm font-medium text-slate-100">{displayName}</p>
                      <p className="mt-1 text-xs text-slate-400">{displayEmail}</p>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        to="/profile"
                        className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
                      >
                        Profile details
                      </Link>
                      <Link
                        to="/orders"
                        className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
                      >
                        Order history
                      </Link>
                      <Link
                        to="/contact"
                        className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
                      >
                        Contact support
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav className="flex flex-wrap gap-2">
            {navigation.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "border border-slate-800 bg-slate-900/75 text-slate-300 hover:border-slate-700 hover:text-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <p className="text-sm text-slate-500">
            Search by name, keyword, brand, category, or product reference.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
