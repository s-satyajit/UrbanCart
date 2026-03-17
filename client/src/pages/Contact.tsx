import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../contexts/product-context";

const emptyStatus = {
  type: "",
  message: "",
};

const Contact = () => {
  const { busyAction, contact, generateContactDraft, session, submitContact } =
    useContext(ProductContext);
  const [form, setForm] = useState({
    name: session.user?.name || "",
    email: session.user?.email || "",
    subject: "",
    howCanWeHelp: "",
  });
  const [submitStatus, setSubmitStatus] = useState(emptyStatus);
  const [draftStatus, setDraftStatus] = useState(emptyStatus);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: session.user?.name || current.name,
      email: session.user?.email || current.email,
    }));
  }, [session.user?.email, session.user?.name]);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleWriteWithAI = async () => {
    setDraftStatus(emptyStatus);
    setSubmitStatus(emptyStatus);

    const prompt = [form.subject, form.howCanWeHelp].filter(Boolean).join("\n");

    if (!form.name.trim() || !form.email.trim()) {
      setDraftStatus({
        type: "error",
        message: "Please add your name and email before using Write with AI.",
      });
      return;
    }

    if (!prompt.trim()) {
      setDraftStatus({
        type: "error",
        message: "Add a few words in subject or how can we help so AI has context.",
      });
      return;
    }

    try {
      const draft = await generateContactDraft({
        name: form.name,
        email: form.email,
        prompt,
      });

      setForm((current) => ({
        ...current,
        subject: draft.subject,
        howCanWeHelp: draft.howCanWeHelp,
      }));
      setDraftStatus({
        type: "success",
        message: "AI filled in a polished subject and message for you.",
      });
    } catch (error) {
      setDraftStatus({
        type: "error",
        message: error.message || "AI could not draft the message right now.",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus(emptyStatus);
    setDraftStatus(emptyStatus);

    try {
      const responseMessage = await submitContact(form);
      setSubmitStatus({
        type: "success",
        message: responseMessage,
      });
      setForm((current) => ({
        ...current,
        subject: "",
        howCanWeHelp: "",
      }));
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "We could not send your message right now.",
      });
    }
  };

  return (
    <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="surface-panel rounded-[32px] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact</p>
        <h1 className="brand-font mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">Reach the team</h1>
        <p className="mt-4 max-w-xl text-slate-400">
          Send product questions, order support requests, or partnership inquiries. If
          you want help writing the message, Urban Cart can draft it for you with AI.
        </p>

        <div className="mt-6 space-y-4">
          {(contact?.channels || []).map((channel) => (
            <div
              key={channel.id}
              className="surface-panel-soft rounded-[24px] p-5"
            >
              <p className="font-medium text-slate-50">{channel.title}</p>
              <p className="mt-2 text-slate-200">{channel.value}</p>
              <p className="mt-2 text-sm text-slate-400">{channel.description}</p>
            </div>
          ))}
        </div>

        <div className="surface-panel-soft mt-6 rounded-[24px] p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Write with AI</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Add your name, email, and a few words about what you need. Urban Cart will
            draft a professional subject and support message for the form.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            {contact?.ai?.enabled
              ? "AI is ready to help with contact drafts."
              : "Add your  API key in the backend env to enable AI drafting."}
          </p>
        </div>
      </div>

      <div className="surface-panel rounded-[32px] p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">Send a message</h2>
            <p className="mt-2 text-sm text-slate-400">
              Fill in the form or let AI draft the message first.
            </p>
          </div>
          <button
            type="button"
            onClick={handleWriteWithAI}
            disabled={busyAction === "contact-ai" || !contact?.ai?.enabled}
            className="btn-secondary rounded-2xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyAction === "contact-ai" ? "Writing..." : "Write with AI"}
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Name"
              className="input-surface w-full rounded-2xl px-4 py-3"
            />
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="Email"
              className="input-surface w-full rounded-2xl px-4 py-3"
            />
          </div>

          <input
            type="text"
            value={form.subject}
            onChange={updateField("subject")}
            placeholder="Subject"
            className="input-surface w-full rounded-2xl px-4 py-3"
          />

          <textarea
            rows={6}
            value={form.howCanWeHelp}
            onChange={updateField("howCanWeHelp")}
            placeholder="How can we help?"
            className="input-surface w-full rounded-2xl px-4 py-3"
          />

          {draftStatus.message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                draftStatus.type === "success"
                  ? "border-slate-700 bg-slate-950 text-slate-200"
                  : "border-red-900/60 bg-red-950/40 text-red-100"
              }`}
            >
              {draftStatus.message}
            </div>
          ) : null}

          {submitStatus.message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                submitStatus.type === "success"
                  ? "border-slate-700 bg-slate-950 text-slate-200"
                  : "border-red-900/60 bg-red-950/40 text-red-100"
              }`}
            >
              {submitStatus.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busyAction === "contact"}
            className="btn-primary rounded-2xl px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyAction === "contact" ? "Sending..." : "Send message"}
          </button>
        </form>

        {(contact?.recentMessages || []).length ? (
          <div className="mt-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Recent messages
            </p>
            <div className="mt-4 space-y-3">
              {contact.recentMessages.map((item) => (
                <div
                  key={item._id || item.id}
                  className="surface-panel-soft rounded-2xl p-4"
                >
                  <p className="font-medium text-slate-50">{item.subject}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {item.howCanWeHelp || item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Contact;
