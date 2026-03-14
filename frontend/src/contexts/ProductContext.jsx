import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import {
  addToCartRequest,
  addToWishlistRequest,
  askAboutStoreRequest,
  createCheckoutRequest,
  deleteCartItemRequest,
  deleteWishlistItemRequest,
  generateContactDraftRequest,
  getAboutContent,
  getCart,
  getContactContent,
  getOrders,
  getProducts,
  getProfile,
  getSession,
  getStorefront,
  getWishlist,
  loginRequest,
  logoutRequest,
  registerRequest,
  searchProductsRequest,
  sendContactMessage,
  updateCartItemRequest,
  updateProfileRequest,
  verifyCheckoutPaymentRequest,
} from "../lib/api";
import { clearSession, readStoredSession, storeSession } from "../lib/session";
import { ProductContext } from "./product-context";

const emptySummary = {
  cartCount: 0,
  cartTotal: 0,
  wishlistCount: 0,
  ordersCount: 0,
};

const emptyProductSearch = {
  query: "",
  items: [],
  total: 0,
  usedAI: false,
  interpreted: null,
  error: "",
  searching: false,
};

export function ProductProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => readStoredSession()?.token || "");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [session, setSession] = useState({
    authenticated: false,
    user: null,
    navigation: [],
    summary: emptySummary,
  });
  const [profile, setProfile] = useState(null);
  const [storefront, setStorefront] = useState(null);
  const [about, setAbout] = useState(null);
  const [contact, setContact] = useState(null);
  const [productSearch, setProductSearch] = useState(emptyProductSearch);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");

  const resetPrivateState = useCallback(() => {
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setProfile(null);
    setSummary(emptySummary);
  }, []);

  const persistSession = useCallback((sessionData) => {
    if (sessionData?.token && sessionData?.expiresAt) {
      storeSession({
        token: sessionData.token,
        expiresAt: sessionData.expiresAt,
      });
      setAuthToken(sessionData.token);
      return;
    }

    clearSession();
    setAuthToken("");
  }, []);

  const loadStore = useCallback(async (tokenOverride) => {
    const resolvedToken =
      typeof tokenOverride === "string"
        ? tokenOverride
        : readStoredSession()?.token || "";

    setLoading(true);
    setError("");

    try {
      const [sessionData, storefrontData, productsData, aboutData, contactData] =
        await Promise.all([
          getSession(resolvedToken),
          getStorefront(resolvedToken),
          getProducts(resolvedToken),
          getAboutContent(resolvedToken),
          getContactContent(resolvedToken),
        ]);

      setSession(sessionData);
      setStorefront(storefrontData);
      setProducts(productsData);
      setAbout(aboutData);
      setContact(contactData);
      setSummary(sessionData.summary || storefrontData.summary || emptySummary);

      if (sessionData.authenticated) {
        persistSession(sessionData);
        const [cartData, wishlistData, ordersData, profileData] = await Promise.all([
          getCart(sessionData.token),
          getWishlist(sessionData.token),
          getOrders(sessionData.token),
          getProfile(sessionData.token),
        ]);

        setCart(cartData.items);
        setWishlist(wishlistData.items);
        setOrders(ordersData.items);
        setProfile(profileData.profile);
        setSummary(profileData.summary || sessionData.summary || emptySummary);
      } else {
        persistSession(null);
        resetPrivateState();
      }
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "We couldn't load the store data.");
      persistSession(null);
      setSession({
        authenticated: false,
        user: null,
        navigation: [],
        summary: emptySummary,
      });
      resetPrivateState();
    } finally {
      setLoading(false);
    }
  }, [persistSession, resetPrivateState]);

  useEffect(() => {
    loadStore(readStoredSession()?.token || "");
  }, [loadStore]);

  const ensureAuth = () => {
    if (!session.authenticated || !authToken) {
      throw new Error("Please sign in to continue.");
    }
  };

  const authenticate = async (mode, payload) => {
    setBusyAction(mode);
    try {
      const response =
        mode === "login"
          ? await loginRequest(payload)
          : await registerRequest(payload);

      persistSession(response);
      await loadStore(response.token);
      return response;
    } finally {
      setBusyAction("");
    }
  };

  const login = (payload) => authenticate("login", payload);
  const register = (payload) => authenticate("register", payload);

  const logout = async () => {
    setBusyAction("logout");
    try {
      if (authToken) {
        try {
          await logoutRequest(authToken);
        } catch (logoutError) {
          void logoutError;
        }
      }
      persistSession(null);
      await loadStore("");
    } finally {
      setBusyAction("");
    }
  };

  const addToCart = async (product, quantity = 1) => {
    ensureAuth();
    setBusyAction(`cart-${product.id}`);
    try {
      const response = await addToCartRequest(product.id, quantity, authToken);
      setCart(response.items);
      setSummary(response.summary);
    } finally {
      setBusyAction("");
    }
  };

  const updateCartItem = async (productId, quantity) => {
    ensureAuth();
    setBusyAction(`cart-update-${productId}`);
    try {
      const response = await updateCartItemRequest(productId, quantity, authToken);
      setCart(response.items);
      setSummary(response.summary);
    } finally {
      setBusyAction("");
    }
  };

  const removeFromCart = async (productId) => {
    ensureAuth();
    setBusyAction(`cart-remove-${productId}`);
    try {
      const response = await deleteCartItemRequest(productId, authToken);
      setCart(response.items);
      setSummary(response.summary);
    } finally {
      setBusyAction("");
    }
  };

  const addToWishlist = async (productId) => {
    ensureAuth();
    setBusyAction(`wishlist-${productId}`);
    try {
      const response = await addToWishlistRequest(productId, authToken);
      setWishlist(response.items);
      setSummary(response.summary);
    } finally {
      setBusyAction("");
    }
  };

  const removeFromWishlist = async (productId) => {
    ensureAuth();
    setBusyAction(`wishlist-remove-${productId}`);
    try {
      const response = await deleteWishlistItemRequest(productId, authToken);
      setWishlist(response.items);
      setSummary(response.summary);
    } finally {
      setBusyAction("");
    }
  };

  const createCheckoutSession = async () => {
    ensureAuth();
    setBusyAction("checkout");
    try {
      const response = await createCheckoutRequest(authToken);
      return response.checkout;
    } finally {
      setBusyAction("");
    }
  };

  const verifyCheckoutPayment = async (payload) => {
    ensureAuth();
    setBusyAction("checkout-verify");
    try {
      const response = await verifyCheckoutPaymentRequest(payload, authToken);
      setOrders(response.items);
      setCart([]);
      setSummary(response.summary);
      return response.order;
    } finally {
      setBusyAction("");
    }
  };

  const updateProfile = async (payload) => {
    ensureAuth();
    setBusyAction("profile");
    try {
      const response = await updateProfileRequest(payload, authToken);
      setProfile(response.profile);
      setSummary(response.summary);
      setSession((current) => ({
        ...current,
        user: {
          ...current.user,
          ...response.profile,
        },
      }));
      return response.message;
    } finally {
      setBusyAction("");
    }
  };

  const submitContact = async (payload) => {
    setBusyAction("contact");
    try {
      const response = await sendContactMessage(payload, authToken);
      setContact((current) => ({
        ...(current || { channels: [], recentMessages: [] }),
        recentMessages: response.recentMessages,
      }));
      return response.message;
    } finally {
      setBusyAction("");
    }
  };

  const searchCatalog = useCallback(async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setProductSearch(emptyProductSearch);
      return null;
    }

    setBusyAction("product-search");
    setProductSearch((current) => ({
      ...current,
      query: trimmedQuery,
      searching: true,
      error: "",
    }));

    try {
      const response = await searchProductsRequest(trimmedQuery, authToken);
      setProductSearch({
        query: response.query,
        items: response.items,
        total: response.total,
        usedAI: response.usedAI,
        interpreted: response.interpreted,
        error: "",
        searching: false,
      });
      return response;
    } catch (error) {
      setProductSearch({
        query: trimmedQuery,
        items: [],
        total: 0,
        usedAI: false,
        interpreted: null,
        error: error.message || "Search failed.",
        searching: false,
      });
      throw error;
    } finally {
      setBusyAction("");
    }
  }, [authToken]);

  const clearCatalogSearch = useCallback(() => {
    setProductSearch(emptyProductSearch);
  }, []);

  const generateContactDraft = async (payload) => {
    setBusyAction("contact-ai");
    try {
      return await generateContactDraftRequest(payload, authToken);
    } finally {
      setBusyAction("");
    }
  };

  const askAboutStore = async (question) => {
    setBusyAction("about-ai");
    try {
      return await askAboutStoreRequest(question, authToken);
    } finally {
      setBusyAction("");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        about,
        askAboutStore,
        authToken,
        busyAction,
        cart,
        contact,
        clearCatalogSearch,
        createCheckoutSession,
        generateContactDraft,
        error,
        isAuthenticated: session.authenticated,
        loading,
        login,
        logout,
        orders,
        products,
        productSearch,
        profile,
        register,
        removeFromCart,
        removeFromWishlist,
        searchCatalog,
        session,
        storefront,
        submitContact,
        summary,
        updateCartItem,
        updateProfile,
        verifyCheckoutPayment,
        wishlist,
        addToCart,
        addToWishlist,
        loadStore,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
