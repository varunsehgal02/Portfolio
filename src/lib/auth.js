"use client";

// Auth config for monitor and edit pages
export const AUTH_CREDENTIALS = {
    id: "varun",
    password: "admin123",
};

export function checkAuth(id, password) {
    return id === AUTH_CREDENTIALS.id && password === AUTH_CREDENTIALS.password;
}

const SESSION_KEY = "portfolio_admin_session";

export function isAuthenticated() {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function setAuthenticated(value) {
    if (typeof window === "undefined") return;
    if (value) {
        sessionStorage.setItem(SESSION_KEY, "true");
    } else {
        sessionStorage.removeItem(SESSION_KEY);
    }
}

export function logout() {
    setAuthenticated(false);
}
