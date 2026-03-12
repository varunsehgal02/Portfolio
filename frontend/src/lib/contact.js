"use client";

import { apiRequest } from "@/lib/api";

function withTimeout(promise, timeoutMs = 15000) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export async function submitContactMessage(payload) {
  const enrichedPayload = {
    ...payload,
    sourcePath: typeof window !== "undefined" ? window.location.pathname : "unknown",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
  };

  return withTimeout(
    apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify(enrichedPayload),
    }),
    15000
  );
}

export async function getContactMessages() {
  try {
    return await apiRequest("/contact");
  } catch {
    return [];
  }
}
