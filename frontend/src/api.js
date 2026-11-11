const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  register: (payload) => request("/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/me"),

  getDashboard: () => request("/dashboard"),

  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/transactions${qs ? `?${qs}` : ""}`);
  },
  addTransaction: (payload) => request("/transactions", { method: "POST", body: payload }),
  updateTransaction: (id, payload) => request(`/transactions/${id}`, { method: "PUT", body: payload }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: "DELETE" }),

  getBudgets: (month) => request(`/budgets${month ? `?month=${month}` : ""}`),
  saveBudget: (payload) => request("/budgets", { method: "POST", body: payload }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: "DELETE" }),
};
