import { useContext, useEffect, useState } from "react";
import AuthPrompt from "../components/AuthPrompt";
import { ProductContext } from "../contexts/product-context";

const Profile = () => {
  const { busyAction, isAuthenticated, profile, summary, updateProfile } =
    useContext(ProductContext);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: {
      line1: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        address: {
          line1: profile.address?.line1 || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zipCode: profile.address?.zipCode || "",
          country: profile.address?.country || "",
        },
      });
    }
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        title="Sign in to view your profile"
        description="Your profile, address, and account activity are stored in MongoDB."
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseMessage = await updateProfile(form);
      setMessage(responseMessage);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="surface-panel rounded-[32px] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
        <h1 className="brand-font mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">{profile?.name}</h1>
        <p className="mt-3 text-slate-400">{profile?.email}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="surface-panel-soft rounded-2xl p-5">
            <p className="text-sm text-slate-400">Cart items</p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.cartCount}</p>
          </div>
          <div className="surface-panel-soft rounded-2xl p-5">
            <p className="text-sm text-slate-400">Saved items</p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">
              {summary.wishlistCount}
            </p>
          </div>
          <div className="surface-panel-soft rounded-2xl p-5">
            <p className="text-sm text-slate-400">Orders</p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">{summary.ordersCount}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="surface-panel rounded-[32px] p-8"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Edit profile</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Full name"
            className="input-surface w-full rounded-2xl px-4 py-3 sm:col-span-2"
          />
          <input
            type="text"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            placeholder="Phone number"
            className="input-surface w-full rounded-2xl px-4 py-3 sm:col-span-2"
          />
          <input
            type="text"
            value={form.address.line1}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: { ...current.address, line1: event.target.value },
              }))
            }
            placeholder="Address line"
            className="input-surface w-full rounded-2xl px-4 py-3 sm:col-span-2"
          />
          <input
            type="text"
            value={form.address.city}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: { ...current.address, city: event.target.value },
              }))
            }
            placeholder="City"
            className="input-surface w-full rounded-2xl px-4 py-3"
          />
          <input
            type="text"
            value={form.address.state}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: { ...current.address, state: event.target.value },
              }))
            }
            placeholder="State"
            className="input-surface w-full rounded-2xl px-4 py-3"
          />
          <input
            type="text"
            value={form.address.zipCode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: { ...current.address, zipCode: event.target.value },
              }))
            }
            placeholder="ZIP code"
            className="input-surface w-full rounded-2xl px-4 py-3"
          />
          <input
            type="text"
            value={form.address.country}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: { ...current.address, country: event.target.value },
              }))
            }
            placeholder="Country"
            className="input-surface w-full rounded-2xl px-4 py-3"
          />
        </div>
        <button
          type="submit"
          disabled={busyAction === "profile"}
          className="btn-primary mt-6 rounded-2xl px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === "profile" ? "Saving..." : "Save profile"}
        </button>
        {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
      </form>
    </section>
  );
};

export default Profile;
