const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export const api = {
  listProducts: (params = "") => request(`/products/${params}`),
  getProduct: (slug) => request(`/products/${slug}/`),
  createCheckoutSession: (items) =>
    request("/checkout/create-session/", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
};
