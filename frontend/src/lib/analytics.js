"use client";

import { apiRequest } from "@/lib/api";
import { getData, saveData } from "@/lib/editableData";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const ANALYTICS_CLICK_URL = `${RAW_API_BASE}/api/analytics/outbound-click`;

export async function trackPageView(page) {
  try {
    await apiRequest("/analytics/page-view", {
      method: "POST",
      body: JSON.stringify({
        page,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
      }),
    });
  } catch {
    // Ignore tracking errors.
  }
}

export async function getVisitHistory() {
  try {
    return await apiRequest("/analytics/history");
  } catch {
    return [];
  }
}

export async function getVisitStats() {
  const history = await getVisitHistory();
  const visits = history || [];
  const now = new Date();

  const today = visits.filter((v) => {
    const d = new Date(v.at);
    return d.toDateString() === now.toDateString();
  }).length;

  const thisWeek = visits.filter((v) => {
    const d = new Date(v.at);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  const thisMonth = visits.filter((v) => {
    const d = new Date(v.at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const pages = {};
  visits.forEach((v) => {
    pages[v.page] = (pages[v.page] || 0) + 1;
  });

  const dailyCounts = {};
  visits.forEach((v) => {
    const day = new Date(v.at).toLocaleDateString();
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  return {
    total: visits.length,
    today,
    thisWeek,
    thisMonth,
    byPage: pages,
    dailyCounts,
  };
}

export async function getLinkedInStats() {
  return getData("linkedinStats", { views: 0, clicks: 0, followers: 0, visitors: [] });
}

export async function setLinkedInStats(stats) {
  await saveData("linkedinStats", stats);
}

export async function getBehanceStats() {
  return getData("behanceStats", { views: 0, appreciations: 0, followers: 0 });
}

export async function setBehanceStats(stats) {
  await saveData("behanceStats", stats);
}

export async function clearAllAnalytics() {
  // Keep this available for compatibility; can be expanded with backend reset route.
}

export async function trackAboutPopupOpen(cardTitle = "Unknown") {
  try {
    await apiRequest("/analytics/about-popup", {
      method: "POST",
      body: JSON.stringify({ cardTitle }),
    });
  } catch {
    // Ignore tracking errors.
  }
}

export function trackSocialOutboundClick(platform, url, sourcePath = "unknown") {
  const payload = {
    platform,
    url,
    sourcePath,
    referrer: typeof document !== "undefined" ? document.referrer : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon(ANALYTICS_CLICK_URL, blob);
    return;
  }

  fetch(ANALYTICS_CLICK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Ignore tracking errors.
  });
}

export async function getOutboundClickSummary() {
  try {
    return await apiRequest("/analytics/outbound-summary");
  } catch {
    return { total: 0, byPlatform: { linkedin: 0, behance: 0 }, recent: [] };
  }
}

export async function getOutboundClickHistory(platform = "") {
  try {
    const query = platform ? `?platform=${encodeURIComponent(platform)}` : "";
    return await apiRequest(`/analytics/outbound-history${query}`);
  } catch {
    return [];
  }
}

export async function getAboutPopupStats() {
  try {
    const summary = await apiRequest("/analytics/summary");
    return {
      totalOpens: summary.aboutPopupOpensTotal || 0,
      byCard: summary.byCard || {},
      lastOpenedAt: null,
    };
  } catch {
    return { totalOpens: 0, byCard: {}, lastOpenedAt: null };
  }
}
