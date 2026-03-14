import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/product-context";

const AuthPage = ({ mode }) => {
  const isSignUp = mode === "sign-up";
  const navigate = useNavigate();
  const { busyAction, isAuthenticated, login, register } = useContext(ProductContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await register(form);
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
      }
      navigate("/profile");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (isAuthenticated) {
    return (
      <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 text-center sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-50">You are already signed in</h1>
        <p className="mt-3 text-slate-400">
          Your cart, wishlist, and orders are ready in the dashboard.
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex rounded-full bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
        >
          Go to profile
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_0.95fr] xl:items-stretch">
      <div className="rounded-[36px] border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(17,24,39,0.96))] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Urban Cart Account
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-50">
          {isSignUp
            ? "Create your account and keep your shopping data connected."
            : "Sign back in to continue with your saved cart, wishlist, and orders."}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          Your session is stored locally for one day and backed by the server so your
          shopping activity stays consistent across the app.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8"
      >
        <h2 className="text-2xl font-semibold text-slate-50">
          {isSignUp ? "Create account" : "Sign in"}
        </h2>
        <div className="mt-6 space-y-4">
          {isSignUp ? (
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600"
            />
          ) : null}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={busyAction === (isSignUp ? "register" : "login")}
          className="mt-6 w-full rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === (isSignUp ? "register" : "login")
            ? "Please wait..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </button>
        <p className="mt-4 text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            to={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-medium text-slate-200 transition hover:text-white"
          >
            {isSignUp ? "Sign in here" : "Create one here"}
          </Link>
        </p>
        {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      </form>
    </section>
  );
};

export default AuthPage;

AuthPage.propTypes = {
  mode: PropTypes.string.isRequired,
};
