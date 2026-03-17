import { useContext, useState } from "react";
import { ProductContext } from "../contexts/product-context";

type InfoPageProps = {
  type: string;
};

const InfoPage = ({ type }: InfoPageProps) => {
  const { about, askAboutStore, busyAction, loading } = useContext(ProductContext);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [askError, setAskError] = useState("");

  if (type !== "about") {
    return null;
  }

  const submitQuestion = async (nextQuestion) => {
    const resolvedQuestion = nextQuestion.trim();

    if (!resolvedQuestion) {
      setAskError("Please ask a question about Urban Cart.");
      return;
    }

    setAskError("");
    setLastQuestion(resolvedQuestion);

    try {
      const response = await askAboutStore(resolvedQuestion);
      setAnswer(response.answer);
      setQuestion(resolvedQuestion);
    } catch (requestError) {
      setAskError(requestError.message || "Urban Cart AI could not answer right now.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitQuestion(question);
  };

  if (loading || !about) {
    return (
      <div className="surface-panel rounded-[32px] p-10 text-center text-slate-300">
        Loading the Urban Cart story...
      </div>
    );
  }

  const aiReady = Boolean(about.ai?.enabled);

  return (
    <section className="space-y-8">
      <div className="surface-panel rounded-[32px] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          {about.eyebrow}
        </p>
        <h1 className="brand-font mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">{about.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
          {about.description}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="surface-panel rounded-[32px] p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Smart FAQs</p>
              <h2 className="brand-font mt-2 text-3xl font-semibold text-slate-50">
                {about.ai?.title || "Ask about Urban Cart"}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Ask about delivery, returns, checkout, product range, or support and get an
              answer based on Urban Cart data.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {(about.ai?.suggestions || about.faqSuggestions || []).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuestion(suggestion);
                  void submitQuestion(suggestion);
                }}
                disabled={busyAction === "about-ai" || !aiReady}
                className="btn-secondary rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-3 block text-sm uppercase tracking-[0.22em] text-slate-400">
                Your question
              </span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                placeholder="Ask something like: Do you deliver fast or how do returns work?"
                className="input-surface w-full rounded-[28px] px-5 py-4 placeholder:text-slate-500"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busyAction === "about-ai" || !aiReady}
                className="btn-primary rounded-full px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === "about-ai" ? "Thinking..." : "Ask Urban Cart"}
              </button>
              <p className="text-sm text-slate-500">
                Answers are grounded in current catalog and store policy data.
              </p>
            </div>
          </form>

          {askError ? (
            <div className="mt-5 rounded-[24px] border border-red-900/60 bg-red-950/40 p-5 text-sm leading-7 text-red-100">
              {askError}
            </div>
          ) : null}

          {answer ? (
            <div className="surface-panel-soft mt-5 rounded-[28px] p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                {lastQuestion ? `Answer to: ${lastQuestion}` : "Urban Cart answer"}
              </p>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-200">
                {answer}
              </p>
            </div>
          ) : (
            <div className="surface-panel-soft mt-5 rounded-[28px] border border-dashed p-6 text-slate-500">
              Ask a question to see a live AI response based on Urban Cart store data.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="surface-panel rounded-[32px] p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Store policies</p>
            <div className="mt-5 space-y-4">
              {(about.policies || []).map((policy) => (
                <article
                  key={policy.title}
                  className="surface-panel-soft rounded-[24px] p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-50">{policy.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{policy.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoPage;
