"use client";

import { apiRequest } from "@/lib/api";

export async function submitContactMessage(payload) {
  const enrichedPayload = {
    ...payload,
    sourcePath: typeof window !== "undefined" ? window.location.pathname : "unknown",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
  };

  return apiRequest("/contact", {
    method: "POST",
    body: JSON.stringify(enrichedPayload),
  });
}

export async function getContactMessages() {
  try {
    return await apiRequest("/contact");
  } catch {
    return [];
  }
}
