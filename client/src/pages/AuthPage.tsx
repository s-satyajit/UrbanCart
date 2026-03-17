import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/product-context";

type AuthPageProps = {
  mode: "sign-in" | "sign-up";
};

const AuthPage = ({ mode }: AuthPageProps) => {
  const isSignUp = mode === "sign-up";
  const navigate = useNavigate();
  const {
    busyAction,
    isAuthenticated,
    login,
    requestRegistrationOtp,
    verifyRegistrationOtp,
  } = useContext(ProductContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");

    try {
      if (isSignUp) {
        if (!form.name.trim()) {
          throw new Error("Please enter your full name.");
        }

        if (!form.email.trim()) {
          throw new Error("Please enter your email address.");
        }

        if (form.password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        if (!otpRequested) {
          const response = await requestRegistrationOtp({
            name: form.name,
            email: form.email,
            password: form.password,
          });
          setOtpRequested(true);
          setInfo(response.message || "OTP sent to your email.");
          return;
        }

        if (form.otp.length !== 6) {
          throw new Error("Please enter the 6-digit OTP.");
        }

        await verifyRegistrationOtp({
          email: form.email,
          otp: form.otp,
        });
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

  const handleResendOtp = async () => {
    setError("");
    setInfo("");

    try {
      const response = await requestRegistrationOtp({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setOtpRequested(true);
      setInfo(response.message || "OTP sent to your email.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (isAuthenticated) {
    return (
      <section className="surface-panel rounded-[32px] p-8 text-center sm:p-10">
        <h1 className="brand-font text-3xl font-semibold text-slate-50">You are already signed in</h1>
        <p className="mt-3 text-slate-400">
          Your cart, wishlist, and orders are ready in the dashboard.
        </p>
        <Link
          to="/profile"
          className="btn-primary mt-6 inline-flex rounded-full px-5 py-3 font-semibold text-slate-950"
        >
          Go to profile
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_0.95fr] xl:items-stretch">
      <div className="surface-panel rounded-[36px] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Urban Cart Account
        </p>
        <h1 className="brand-font mt-4 text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
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
        className="surface-panel rounded-[32px] p-8"
      >
        <h2 className="brand-font text-2xl font-semibold text-slate-50">
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
              disabled={otpRequested}
              className="input-surface w-full rounded-2xl px-4 py-3"
            />
          ) : null}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            disabled={otpRequested}
            className="input-surface w-full rounded-2xl px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            disabled={otpRequested}
            className="input-surface w-full rounded-2xl px-4 py-3"
          />
          {isSignUp && otpRequested ? (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  otp: event.target.value.replace(/\D/g, "").slice(0, 6),
                }))
              }
              className="input-surface w-full rounded-2xl px-4 py-3"
            />
          ) : null}
        </div>
        <button
          type="submit"
          disabled={
            busyAction === "login" ||
            busyAction === "register" ||
            busyAction === "register-verify"
          }
          className="btn-primary mt-6 w-full rounded-2xl px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === "login" ||
          busyAction === "register" ||
          busyAction === "register-verify"
            ? "Please wait..."
            : isSignUp
              ? otpRequested
                ? "Verify OTP and create account"
                : "Send OTP"
              : "Sign in"}
        </button>
        {isSignUp && otpRequested ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={busyAction === "register"}
              className="btn-secondary rounded-2xl px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpRequested(false);
                setForm((current) => ({ ...current, otp: "" }));
                setError("");
                setInfo("");
              }}
              className="btn-secondary rounded-2xl px-4 py-2 text-sm font-medium"
            >
              Edit details
            </button>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            to={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-medium text-slate-200 transition hover:text-white"
          >
            {isSignUp ? "Sign in here" : "Create one here"}
          </Link>
        </p>
        {info ? <p className="mt-4 text-sm text-emerald-200">{info}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      </form>
    </section>
  );
};

export default AuthPage;
