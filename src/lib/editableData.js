"use client";

// Editable data utility — checks localStorage overrides, falls back to defaults
const EDITABLE_DATA_KEY = "portfolio_editable_data";

function getAllEdits() {
    if (typeof window === "undefined") return {};
    try {
        const data = localStorage.getItem(EDITABLE_DATA_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

export function getData(key, defaultValue) {
    const edits = getAllEdits();
    if (edits[key] !== undefined) return edits[key];
    return defaultValue;
}

export function saveData(key, value) {
    if (typeof window === "undefined") return;
    const edits = getAllEdits();
    edits[key] = value;
    localStorage.setItem(EDITABLE_DATA_KEY, JSON.stringify(edits));
}

export function resetData(key) {
    if (typeof window === "undefined") return;
    const edits = getAllEdits();
    delete edits[key];
    localStorage.setItem(EDITABLE_DATA_KEY, JSON.stringify(edits));
}

export function resetAllData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(EDITABLE_DATA_KEY);
}

export function hasEdits(key) {
    const edits = getAllEdits();
    return edits[key] !== undefined;
}
