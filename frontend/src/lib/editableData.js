"use client";

import { apiRequest } from "@/lib/api";

export async function getData(key, defaultValue) {
    try {
        const data = await apiRequest(`/content/${key}`);
        return data?.value !== undefined ? data.value : defaultValue;
    } catch {
        return defaultValue;
    }
}

export async function saveData(key, value) {
    await apiRequest(`/content/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
    });
}

export async function resetData(key) {
    await apiRequest(`/content/${key}`, {
        method: "DELETE",
    });
}

export async function resetAllData() {
    await apiRequest(`/content`, {
        method: "DELETE",
    });
}

export async function hasEdits(key) {
    try {
        await apiRequest(`/content/${key}`);
        return true;
    } catch {
        return false;
    }
}
