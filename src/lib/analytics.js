"use client";

// Analytics tracking utility using localStorage
const STORAGE_KEY = "portfolio_analytics";
const LINKEDIN_KEY = "portfolio_linkedin_stats";
const BEHANCE_KEY = "portfolio_behance_stats";

function getAnalytics() {
    if (typeof window === "undefined") return { visits: [], totalViews: 0 };
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { visits: [], totalViews: 0 };
    } catch {
        return { visits: [], totalViews: 0 };
    }
}

function saveAnalytics(data) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function trackPageView(page) {
    const analytics = getAnalytics();
    const visit = {
        id: Date.now(),
        page,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    };
    analytics.visits.push(visit);
    analytics.totalViews = (analytics.totalViews || 0) + 1;
    saveAnalytics(analytics);
}

export function getVisitHistory() {
    const analytics = getAnalytics();
    return (analytics.visits || []).slice().reverse();
}

export function getVisitStats() {
    const analytics = getAnalytics();
    const visits = analytics.visits || [];
    const now = new Date();

    const today = visits.filter((v) => {
        const d = new Date(v.timestamp);
        return d.toDateString() === now.toDateString();
    }).length;

    const thisWeek = visits.filter((v) => {
        const d = new Date(v.timestamp);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
    }).length;

    const thisMonth = visits.filter((v) => {
        const d = new Date(v.timestamp);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const pages = {};
    visits.forEach((v) => {
        pages[v.page] = (pages[v.page] || 0) + 1;
    });

    const dailyCounts = {};
    visits.forEach((v) => {
        const day = new Date(v.timestamp).toLocaleDateString();
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    return {
        total: analytics.totalViews || visits.length,
        today,
        thisWeek,
        thisMonth,
        byPage: pages,
        dailyCounts,
    };
}

export function getLinkedInStats() {
    if (typeof window === "undefined") return { views: 0, clicks: 0, followers: 0, visitors: [] };
    try {
        const data = localStorage.getItem(LINKEDIN_KEY);
        return data ? JSON.parse(data) : { views: 0, clicks: 0, followers: 0, visitors: [] };
    } catch {
        return { views: 0, clicks: 0, followers: 0, visitors: [] };
    }
}

export function setLinkedInStats(stats) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LINKEDIN_KEY, JSON.stringify(stats));
}

export function getBehanceStats() {
    if (typeof window === "undefined") return { views: 0, appreciations: 0, followers: 0 };
    try {
        const data = localStorage.getItem(BEHANCE_KEY);
        return data ? JSON.parse(data) : { views: 0, appreciations: 0, followers: 0 };
    } catch {
        return { views: 0, appreciations: 0, followers: 0 };
    }
}

export function setBehanceStats(stats) {
    if (typeof window === "undefined") return;
    localStorage.setItem(BEHANCE_KEY, JSON.stringify(stats));
}

export function clearAllAnalytics() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LINKEDIN_KEY);
    localStorage.removeItem(BEHANCE_KEY);
}
