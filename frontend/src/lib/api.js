"use client";

const API_BASE = "/api";

function getToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("portfolio_admin_token") || "";
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      // ignore parse failures
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
