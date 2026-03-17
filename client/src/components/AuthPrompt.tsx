import { Link } from "react-router-dom";

type AuthPromptProps = {
  title: string;
  description: string;
};

const AuthPrompt = ({ title, description }: AuthPromptProps) => {
  return (
    <section className="surface-panel rounded-[32px] p-8 text-center sm:p-10">
      <h1 className="brand-font text-3xl font-semibold text-slate-50">{title}</h1>
      <p className="mt-3 text-slate-400">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/sign-in"
          className="btn-primary rounded-full px-5 py-3 font-semibold text-slate-950"
        >
          Sign in
        </Link>
        <Link
          to="/sign-up"
          className="btn-secondary rounded-full px-5 py-3 font-semibold"
        >
          Create account
        </Link>
      </div>
    </section>
  );
};

export default AuthPrompt;
