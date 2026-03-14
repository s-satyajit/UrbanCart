import { Outlet } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1220_0%,#111827_38%,#0f172a_100%)] text-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
