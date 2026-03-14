import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/app-layout";
import AuthPage from "./pages/AuthPage";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import DisplayProducts from "./pages/DisplayProducts";
import Home from "./pages/Home";
import InfoPage from "./pages/InfoPage";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <DisplayProducts /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "orders", element: <Orders /> },
      { path: "profile", element: <Profile /> },
      { path: "about", element: <InfoPage type="about" /> },
      { path: "contact", element: <Contact /> },
      { path: "sign-in", element: <AuthPage mode="sign-in" /> },
      { path: "sign-up", element: <AuthPage mode="sign-up" /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
