import { Outlet } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

const AppLayout = () => {
  return (
    <div className="app-shell min-h-screen text-slate-50">
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
