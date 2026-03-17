import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../contexts/product-context";

const Footer = () => {
  const { busyAction, isAuthenticated, logout, session } = useContext(ProductContext);
  const navigation = session.navigation || [];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto px-3 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
      <div className="surface-panel mx-auto w-full max-w-screen-2xl overflow-hidden rounded-[32px]">
        <div className="grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 xl:px-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="brand-font flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(130deg,#f8fafc_0%,#d3f9f4_100%)] text-sm font-bold text-slate-950">
                UC
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  Urban Cart
                </p>
                <p className="brand-font text-base font-medium text-slate-100">
                  Built for a clean, reliable shopping experience.
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Urban Cart connects browsing, account management, cart, wishlist, orders,
              support, payments, and AI-assisted help into one backend-driven storefront.
            </p>
            <p className="text-sm text-slate-400">
              Contact:{" "}
              <a
                href="mailto:satyajit.samal@outlook.in"
                className="font-medium text-slate-200 transition hover:text-white"
              >
                satyajit.samal@outlook.in
              </a>
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Quick Links
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
                {navigation.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Account
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>{isAuthenticated ? `${session.user?.name} signed in` : "Guest session"}</p>
                <p className="text-slate-500">
                  {isAuthenticated
                    ? session.user?.email
                    : "Sign in to sync cart, wishlist, orders, and support history."}
                </p>
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={logout}
                    disabled={busyAction === "logout"}
                    className="btn-secondary rounded-2xl px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyAction === "logout" ? "Signing out..." : "Sign out"}
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/sign-in"
                      className="btn-secondary rounded-2xl px-4 py-3 font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/sign-up"
                      className="btn-primary rounded-2xl px-4 py-3 font-medium text-slate-950"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/70">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-10">
            <p>{year} Urban Cart. All rights reserved.</p>
            <p>Designed to feel closer to a production ecommerce storefront.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
