"use client";

import { apiRequest } from "@/lib/api";

const SESSION_KEY = "portfolio_admin_token";

export function isAuthenticated() {
    if (typeof window === "undefined") return false;
    return Boolean(sessionStorage.getItem(SESSION_KEY));
}

export function setAuthenticated(value, token = "") {
    if (typeof window === "undefined") return;
    if (value) {
        if (token) sessionStorage.setItem(SESSION_KEY, token);
    } else {
        sessionStorage.removeItem(SESSION_KEY);
    }
}

export async function login(id, password) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ id, password }),
    });

    setAuthenticated(true, data.token);
    return data;
}

export function logout() {
    setAuthenticated(false);
}
