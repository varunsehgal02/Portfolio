"use client";

import { apiRequest } from "@/lib/api";

export async function submitContactMessage(payload) {
  return apiRequest("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getContactMessages() {
  try {
    return await apiRequest("/contact");
  } catch {
    return [];
  }
}
