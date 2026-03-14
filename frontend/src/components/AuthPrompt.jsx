import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AuthPrompt = ({ title, description }) => {
  return (
    <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 text-center sm:p-10">
      <h1 className="text-3xl font-semibold text-slate-50">{title}</h1>
      <p className="mt-3 text-slate-400">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/sign-in"
          className="rounded-full bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
        >
          Sign in
        </Link>
        <Link
          to="/sign-up"
          className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-950"
        >
          Create account
        </Link>
      </div>
    </section>
  );
};

export default AuthPrompt;

AuthPrompt.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
