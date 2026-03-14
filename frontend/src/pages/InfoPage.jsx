import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { ProductContext } from "../contexts/product-context";

const InfoPage = ({ type }) => {
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
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-300">
        Loading the Urban Cart story...
      </div>
    );
  }

  const aiReady = Boolean(about.ai?.enabled);

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          {about.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-50">{about.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
          {about.description}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Smart FAQs</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">
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
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="w-full rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-600"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busyAction === "about-ai" || !aiReady}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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
            <div className="mt-5 rounded-[28px] border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                {lastQuestion ? `Answer to: ${lastQuestion}` : "Urban Cart answer"}
              </p>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-200">
                {answer}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-[28px] border border-dashed border-slate-800 bg-slate-950/50 p-6 text-slate-500">
              Ask a question to see a live AI response based on Urban Cart store data.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Store policies</p>
            <div className="mt-5 space-y-4">
              {(about.policies || []).map((policy) => (
                <article
                  key={policy.title}
                  className="rounded-[24px] border border-slate-800 bg-slate-950 p-5"
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

InfoPage.propTypes = {
  type: PropTypes.string.isRequired,
};
