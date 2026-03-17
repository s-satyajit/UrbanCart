const defaultHeaders = {
  "Content-Type": "application/json",
};

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = configuredApiUrl ? configuredApiUrl.replace(/\/+$/, "") : "";

function resolveApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
}

async function request(path: string, options: RequestInit = {}, authToken = "") {
  const response = await fetch(resolveApiUrl(path), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

export const getSession = (authToken) => request("/api/auth/session", {}, authToken);
export const loginRequest = (body) =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
export const requestRegistrationOtpRequest = (body) =>
  request("/api/auth/register/request-otp", { method: "POST", body: JSON.stringify(body) });
export const verifyRegistrationOtpRequest = (body) =>
  request("/api/auth/register/verify", { method: "POST", body: JSON.stringify(body) });
export const logoutRequest = (authToken) =>
  request("/api/auth/logout", { method: "POST" }, authToken);

export const getProducts = (authToken) => request("/api/products", {}, authToken);
export const searchProductsRequest = (query, authToken) =>
  request(`/api/products/search?q=${encodeURIComponent(query)}`, {}, authToken);
export const getStorefront = (authToken) => request("/api/storefront", {}, authToken);
export const getCart = (authToken) => request("/api/cart", {}, authToken);
export const getWishlist = (authToken) => request("/api/wishlist", {}, authToken);
export const getOrders = (authToken) => request("/api/orders", {}, authToken);
export const getProfile = (authToken) => request("/api/profile", {}, authToken);
export const getAboutContent = (authToken) =>
  request("/api/content/about", {}, authToken);
export const askAboutStoreRequest = (question, authToken) =>
  request(
    "/api/content/about/ask",
    {
      method: "POST",
      body: JSON.stringify({ question }),
    },
    authToken
  );
export const getContactContent = (authToken) =>
  request("/api/contact", {}, authToken);
export const generateContactDraftRequest = (payload, authToken) =>
  request(
    "/api/contact/ai-draft",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    authToken
  );

export const addToCartRequest = (productId, quantity, authToken) =>
  request(
    "/api/cart/items",
    {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    },
    authToken
  );

export const updateCartItemRequest = (productId, quantity, authToken) =>
  request(
    `/api/cart/items/${productId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    },
    authToken
  );

export const deleteCartItemRequest = (productId, authToken) =>
  request(
    `/api/cart/items/${productId}`,
    {
      method: "DELETE",
    },
    authToken
  );

export const addToWishlistRequest = (productId, authToken) =>
  request(
    "/api/wishlist/items",
    {
      method: "POST",
      body: JSON.stringify({ productId }),
    },
    authToken
  );

export const deleteWishlistItemRequest = (productId, authToken) =>
  request(
    `/api/wishlist/items/${productId}`,
    {
      method: "DELETE",
    },
    authToken
  );

export const createCheckoutRequest = (authToken) =>
  request(
    "/api/orders/checkout",
    {
      method: "POST",
    },
    authToken
  );

export const verifyCheckoutPaymentRequest = (payload, authToken) =>
  request(
    "/api/orders/checkout/verify",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    authToken
  );

export const updateProfileRequest = (payload, authToken) =>
  request(
    "/api/profile",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    authToken
  );

export const sendContactMessage = (payload, authToken) =>
  request(
    "/api/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    authToken
  );
