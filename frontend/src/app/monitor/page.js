"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLogin from "@/components/AdminLogin";
import NetworkBackground from "@/components/NetworkBackground";
import TargetCursor from "@/components/TargetCursor/TargetCursor";
import { isAuthenticated, logout } from "@/lib/auth";
import {
    getVisitStats,
    getVisitHistory,
    getLinkedInStats,
    setLinkedInStats,
    getBehanceStats,
    setBehanceStats,
    getAboutPopupStats,
    getOutboundClickSummary,
    getOutboundClickHistory,
    getVisitorProfile,
    getEngagementStats,
    resetPageAnalytics,
    deletePageViewById,
    clearAllAnalytics,
    clearVisitHistory,
} from "@/lib/analytics";
import { getContactMessages } from "@/lib/contact";

export default function MonitorPage() {
    const ensureRecordArray = (value) => (Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : []);
    const toSafeDate = (value) => {
        const date = value ? new Date(value) : null;
        return date && !Number.isNaN(date.getTime()) ? date : null;
    };

    const [authed, setAuthed] = useState(false);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [linkedin, setLinkedin] = useState({ views: 0, clicks: 0, followers: 0 });
    const [behance, setBehance] = useState({ views: 0, appreciations: 0, followers: 0 });
    const [aboutPopupStats, setAboutPopupStats] = useState({ totalOpens: 0, byCard: {}, lastOpenedAt: null });
    const [outboundSummary, setOutboundSummary] = useState({ total: 0, byPlatform: { linkedin: 0, behance: 0 }, recent: [] });
    const [outboundHistory, setOutboundHistory] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [engagement, setEngagement] = useState(null);
    const [openIpFolders, setOpenIpFolders] = useState({});
    const [openMessageIpFolders, setOpenMessageIpFolders] = useState({});
    const [ipLocations, setIpLocations] = useState({});
    const [loadingIpLocations, setLoadingIpLocations] = useState({});
    const [activeTab, setActiveTab] = useState("overview");
    const [editingLinkedin, setEditingLinkedin] = useState(false);
    const [editingBehance, setEditingBehance] = useState(false);
    const [liveTime, setLiveTime] = useState(new Date());

    const safeStats = stats && typeof stats === "object"
        ? {
            total: Number(stats.total) || 0,
            today: Number(stats.today) || 0,
            thisWeek: Number(stats.thisWeek) || 0,
            thisMonth: Number(stats.thisMonth) || 0,
            byPage: stats.byPage && typeof stats.byPage === "object" && !Array.isArray(stats.byPage) ? stats.byPage : {},
            dailyCounts: stats.dailyCounts && typeof stats.dailyCounts === "object" && !Array.isArray(stats.dailyCounts) ? stats.dailyCounts : {},
        }
        : null;

    const loadData = useCallback(async () => {
        const [statsNext, historyNext, linkedinNext, behanceNext, popupNext, outboundSummaryNext, outboundHistoryNext, engagementNext] = await Promise.all([
            getVisitStats(),
            getVisitHistory(),
            getLinkedInStats(),
            getBehanceStats(),
            getAboutPopupStats(),
            getOutboundClickSummary(),
            getOutboundClickHistory(),
            getEngagementStats(),
        ]);

        const messagesNext = await getContactMessages();

        setStats(statsNext);
        setHistory(ensureRecordArray(historyNext));
        setLinkedin(linkedinNext);
        setBehance(behanceNext);
        setAboutPopupStats(popupNext);
        setOutboundSummary(outboundSummaryNext);
        setOutboundHistory(ensureRecordArray(outboundHistoryNext));
        setContactMessages(ensureRecordArray(messagesNext));
        setEngagement(engagementNext);
    }, []);

    useEffect(() => {
        if (isAuthenticated()) {
            setAuthed(true);
            loadData().catch(() => {});
        }
    }, [loadData]);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setLiveTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLinkedinSave = async () => {
        const { clicks: _trackedClicks, ...manualLinkedin } = linkedin;
        await setLinkedInStats(manualLinkedin);
        setEditingLinkedin(false);
    };

    const handleBehanceSave = async () => {
        await setBehanceStats(behance);
        setEditingBehance(false);
    };

    const handleResetPage = async (page) => {
        if (!page) return;
        const confirmed = window.confirm(`Restart analytics for ${page}? This clears tracked data for this page only.`);
        if (!confirmed) return;
        await resetPageAnalytics(page);
        await loadData();
    };

    const handleDeleteVisit = async (id) => {
        if (!id) return;
        const confirmed = window.confirm("Delete this visit record?");
        if (!confirmed) return;
        await deletePageViewById(id);
        await loadData();
    };

    const handleDeleteAllAnalytics = async () => {
        const confirmed = window.confirm("Delete ALL analytics data? This action cannot be undone.");
        if (!confirmed) return;
        await clearAllAnalytics();
        await loadData();
    };

    const handleClearVisitLog = async () => {
        const confirmed = window.confirm("Clear all entries in Visit Log? This will remove visit history data only.");
        if (!confirmed) return;
        await clearVisitHistory();
        await loadData();
    };

    const socialTrend = useMemo(() => {
        const formatKey = (date) => {
            const year = date.getFullYear();
            const month = `${date.getMonth() + 1}`.padStart(2, "0");
            const day = `${date.getDate()}`.padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const days = [];
        const now = new Date();

        for (let offset = 6; offset >= 0; offset -= 1) {
            const date = new Date(now);
            date.setHours(0, 0, 0, 0);
            date.setDate(now.getDate() - offset);
            days.push({
                key: formatKey(date),
                label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                linkedin: 0,
                behance: 0,
            });
        }

        const dayMap = Object.fromEntries(days.map((day) => [day.key, day]));

        ensureRecordArray(outboundHistory).forEach((entry) => {
            const date = toSafeDate(entry.at);
            if (!date) return;
            const key = formatKey(date);
            const day = dayMap[key];
            if (!day) return;

            if (entry.platform === "linkedin") day.linkedin += 1;
            if (entry.platform === "behance") day.behance += 1;
        });

        const maxValue = Math.max(1, ...days.flatMap((day) => [day.linkedin, day.behance]));
        return { days, maxValue };
    }, [outboundHistory]);

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "engagement", label: "Engagement", icon: "🎯" },
        { id: "history", label: "Visit Log", icon: "📋" },
        { id: "social", label: "Social Stats", icon: "🔗" },
        { id: "messages", label: "Messages", icon: "✉️" },
    ];

    const statCards = safeStats ? [
        { label: "Today", value: safeStats.today, icon: "📅", color: "from-primary to-secondary", textColor: "text-primary-light" },
        { label: "This Week", value: safeStats.thisWeek, icon: "📊", color: "from-primary-light to-primary", textColor: "text-primary-light" },
        { label: "This Month", value: safeStats.thisMonth, icon: "📈", color: "from-secondary to-primary", textColor: "text-primary-light" },
        { label: "All Time", value: safeStats.total, icon: "🌟", color: "from-primary to-accent", textColor: "text-primary-light" },
    ] : [];

    const trackedLinkedinClicks = outboundSummary.byPlatform?.linkedin || 0;
    const trackedBehanceClicks = outboundSummary.byPlatform?.behance || 0;
    const trackedGithubClicks = outboundSummary.byPlatform?.github || 0;

    const getBrowserName = (userAgent = "") => {
        const ua = String(userAgent).toLowerCase();
        if (!ua) return "Unknown";
        if (ua.includes("edg/")) return "Edge";
        if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
        if (ua.includes("chrome/") && !ua.includes("edg/")) return "Chrome";
        if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
        if (ua.includes("firefox/")) return "Firefox";
        return "Other";
    };

    const getDeviceType = (userAgent = "", screenWidth = 0) => {
        const ua = String(userAgent).toLowerCase();
        if (ua.includes("ipad") || ua.includes("tablet")) return "Tablet";
        if (ua.includes("mobi") || Number(screenWidth) < 768) return "Mobile";
        return "Desktop";
    };

    const fetchBrowserGeo = async (ip) => {
        const res = await fetch(`/api/geoip?ip=${encodeURIComponent(ip)}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data?.geolocation || null;
    };

    const loadIpLocation = async (ip) => {
        if (!ip || ip === "Unknown" || ipLocations[ip] || loadingIpLocations[ip]) {
            return;
        }

        setLoadingIpLocations((prev) => ({ ...prev, [ip]: true }));

        try {
            const profile = await getVisitorProfile(ip);
            let geo = profile?.geolocation || null;

            if (!geo) {
                geo = await fetchBrowserGeo(ip);
            }

            if (geo) {
                setIpLocations((prev) => ({ ...prev, [ip]: geo }));
            }
        } catch {
            try {
                const geo = await fetchBrowserGeo(ip);
                if (geo) {
                    setIpLocations((prev) => ({ ...prev, [ip]: geo }));
                }
            } catch {
                // Ignore geo fallback errors.
            }
        } finally {
            setLoadingIpLocations((prev) => ({ ...prev, [ip]: false }));
        }
    };

    const groupedHistory = useMemo(() => {
        const grouped = {};

        ensureRecordArray(history).forEach((visit) => {
            const ip = visit.ip || "Unknown";
            if (!grouped[ip]) grouped[ip] = [];
            grouped[ip].push(visit);
        });

        return Object.entries(grouped)
            .map(([ip, visits]) => {
                const lastVisit = visits[0];
                const pageSet = Array.from(new Set(visits.map((v) => v?.page).filter(Boolean))).slice(0, 5);
                return {
                    ip,
                    visits,
                    count: visits.length,
                    lastVisitAt: lastVisit?.at || "",
                    browsers: Array.from(new Set(visits.map((v) => getBrowserName(v?.userAgent)).values())),
                    devices: Array.from(new Set(visits.map((v) => getDeviceType(v?.userAgent, v?.screenWidth)).values())),
                    pages: pageSet,
                };
            })
            .sort((a, b) => new Date(b.lastVisitAt).getTime() - new Date(a.lastVisitAt).getTime());
    }, [history]);

    const toggleIpFolder = (ip) => {
        loadIpLocation(ip).catch(() => {});

        setOpenIpFolders((prev) => ({
            ...prev,
            [ip]: !prev[ip],
        }));
    };

    const getLocationLabel = (ip) => {
        const geo = ipLocations[ip];
        if (!geo) return "Location unavailable";

        const parts = [geo.city, geo.region, geo.country].filter(Boolean);
        if (parts.length === 0) return "Location unavailable";
        return parts.join(", ");
    };

    const groupedMessages = useMemo(() => {
        const grouped = {};

        ensureRecordArray(contactMessages).forEach((msg) => {
            const ip = msg.ip || "Unknown";
            if (!grouped[ip]) grouped[ip] = [];
            grouped[ip].push(msg);
        });

        return Object.entries(grouped)
            .map(([ip, messages]) => ({
                ip,
                messages,
                count: messages.length,
                lastMessageAt: messages[0]?.createdAt || "",
                senders: Array.from(new Set(messages.map((m) => m?.email).filter(Boolean))).slice(0, 4),
            }))
            .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    }, [contactMessages]);

    const toggleMessageFolder = (ip) => {
        loadIpLocation(ip).catch(() => {});

        setOpenMessageIpFolders((prev) => ({
            ...prev,
            [ip]: !prev[ip],
        }));
    };

    if (!authed) {
        return (
            <AdminLogin
                title="Monitor Dashboard"
                onSuccess={() => {
                    setAuthed(true);
                    loadData().catch(() => {});
                }}
            />
        );
    }

    return (
        <div className="relative min-h-screen pt-28 pb-20">
            <TargetCursor
                targetSelector="button, a, input, textarea, select, .cursor-target"
                spinDuration={2}
                hideDefaultCursor
                parallaxOn
                hoverDuration={0.2}
            />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <NetworkBackground className="opacity-90" />
            </div>

            <div className="relative z-[1] max-w-7xl mx-auto px-6">
            {/* Header with live clock */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-display font-bold text-3xl sm:text-4xl text-text-primary"
                    >
                        Monitor <span className="gradient-text">Dashboard</span>
                    </motion.h1>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-text-muted text-sm">
                            Track your portfolio analytics & social stats
                        </p>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-xs font-mono">
                                {liveTime.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadData().catch(() => {})}
                        className="px-4 py-2 rounded-xl glass text-text-secondary text-sm hover:text-primary-light hover:border-primary/30 transition-all flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            setAuthed(false);
                        }}
                        className="px-4 py-2 rounded-xl glass text-text-secondary text-sm hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 p-1 rounded-2xl glass inline-flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                            ? "bg-gradient-to-r from-primary to-secondary text-black shadow-lg shadow-primary/25"
                            : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ===== OVERVIEW TAB ===== */}
                {activeTab === "overview" && safeStats && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {statCards.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass rounded-2xl p-6 card-hover group relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${stat.color}`} />
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">{stat.icon}</span>
                                        <span className="text-text-muted text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                    <p className={`font-display font-bold text-4xl ${stat.textColor} group-hover:scale-110 transition-transform origin-left`}>
                                        {stat.value}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🪟</span>
                                    About Card Popups
                                </h3>
                                <span className="text-text-muted text-xs">Total opens: {aboutPopupStats.totalOpens || 0}</span>
                            </div>
                            <div className="space-y-2">
                                {Object.keys(aboutPopupStats.byCard || {}).length > 0 ? (
                                    Object.entries(aboutPopupStats.byCard)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 6)
                                        .map(([card, count]) => (
                                            <div key={card} className="flex items-center justify-between rounded-lg bg-surface-light/50 px-3 py-2">
                                                <span className="text-text-secondary text-sm">{card}</span>
                                                <span className="text-primary-light text-sm font-semibold">{count}</span>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-text-muted text-sm">No popup opens yet. Open About cards to populate this panel.</p>
                                )}
                            </div>
                        </div>

                        {/* Page Views Breakdown */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📊</span>
                                    Page Views Breakdown
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-text-muted text-xs">{Object.keys(safeStats.byPage).length} pages tracked</span>
                                    <button
                                        onClick={() => handleDeleteAllAnalytics().catch(() => {})}
                                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                                    >
                                        Delete All
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(safeStats.byPage).map(([page, count]) => {
                                    const maxCount = Math.max(1, ...Object.values(safeStats.byPage));
                                    const percentage = (count / maxCount) * 100;
                                    return (
                                        <div key={page} className="group">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-text-secondary text-sm font-mono group-hover:text-primary-light transition-colors">
                                                    {page}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-text-primary text-sm font-bold">
                                                        {count} <span className="text-text-muted font-normal text-xs">visits</span>
                                                    </span>
                                                    <button
                                                        onClick={() => handleResetPage(page).catch(() => {})}
                                                        className="px-2 py-0.5 rounded text-[11px] border border-primary/30 text-primary-light hover:bg-primary/10 transition-colors"
                                                    >
                                                        Restart
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPage(page).catch(() => {})}
                                                        className="px-2 py-0.5 rounded text-[11px] border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1 h-2.5 rounded-full bg-surface-light overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {Object.keys(safeStats.byPage).length === 0 && (
                                    <div className="text-center py-8">
                                        <span className="text-4xl block mb-3">📭</span>
                                        <p className="text-text-muted text-sm">No page views recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Daily Trend Chart */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-sm">📈</span>
                                    Daily Visits
                                </h3>
                                <span className="text-text-muted text-xs">Last 14 days</span>
                            </div>
                            <div className="flex items-end gap-2 h-40">
                                {Object.entries(safeStats.dailyCounts)
                                    .slice(-14)
                                    .map(([date, count], i) => {
                                        const maxDaily = Math.max(1, ...Object.values(safeStats.dailyCounts));
                                        const height = (count / maxDaily) * 100;
                                        return (
                                            <div key={date} className="flex-1 flex flex-col items-center gap-1 group">
                                                <span className="text-primary-light text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {count}
                                                </span>
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max(height, 4)}%` }}
                                                    transition={{ duration: 0.6, delay: i * 0.05 }}
                                                    className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary group-hover:from-primary-light group-hover:to-secondary transition-colors min-h-[4px] cursor-pointer"
                                                    title={`${date}: ${count} visits`}
                                                />
                                                <span className="text-text-muted text-[8px] rotate-[-45deg] origin-top-left mt-3 whitespace-nowrap">
                                                    {date.split("/").slice(0, 2).join("/")}
                                                </span>
                                            </div>
                                        );
                                    })}
                                {Object.keys(safeStats.dailyCounts).length === 0 && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <p className="text-text-muted text-sm">No data yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ===== ENGAGEMENT TAB ===== */}
                {activeTab === "engagement" && (
                    <motion.div
                        key="engagement"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Device + Browser Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2 mb-4">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📱</span>
                                    Device Breakdown
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(engagement?.devices || { Desktop: 0, Mobile: 0, Tablet: 0 }).map(([device, count]) => {
                                        const total = Object.values(engagement?.devices || {}).reduce((a, b) => a + b, 0) || 1;
                                        const pct = Math.round((count / total) * 100);
                                        const icons = { Desktop: "🖥️", Mobile: "📱", Tablet: "📋" };
                                        return (
                                            <div key={device}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-text-secondary text-sm">{icons[device] || "💻"} {device}</span>
                                                    <span className="text-text-primary text-sm font-semibold">{count} <span className="text-text-muted font-normal text-xs">({pct}%)</span></span>
                                                </div>
                                                <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.8 }}
                                                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2 mb-4">
                                    <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-sm">🌐</span>
                                    Browser Breakdown
                                </h3>
                                <div className="space-y-3">
                                    {Object.keys(engagement?.browsers || {}).length === 0 && (
                                        <p className="text-text-muted text-sm">No data yet.</p>
                                    )}
                                    {Object.entries(engagement?.browsers || {})
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([browser, count]) => {
                                            const total = Object.values(engagement?.browsers || {}).reduce((a, b) => a + b, 0) || 1;
                                            const pct = Math.round((count / total) * 100);
                                            return (
                                                <div key={browser}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-text-secondary text-sm">{browser}</span>
                                                        <span className="text-text-primary text-sm font-semibold">{count} <span className="text-text-muted font-normal text-xs">({pct}%)</span></span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.8 }}
                                                            className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* Avg Time on Page */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">⏱️</span>
                                Avg Time on Page
                            </h3>
                            {Object.keys(engagement?.avgTimeByPage || {}).length === 0 ? (
                                <p className="text-text-muted text-sm">No data yet. Visitors need to spend ≥2s on a page.</p>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(engagement?.avgTimeByPage || {})
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([page, secs]) => {
                                            const maxSecs = Math.max(1, ...Object.values(engagement?.avgTimeByPage || {}));
                                            const pct = (secs / maxSecs) * 100;
                                            const display = secs >= 60 ? `${Math.floor(secs / 60)}m ${secs % 60}s` : `${secs}s`;
                                            return (
                                                <div key={page}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-text-secondary text-sm font-mono">{page}</span>
                                                        <span className="text-primary-light text-sm font-semibold">{display}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.8 }}
                                                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* Scroll Depth */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📜</span>
                                Scroll Depth by Page
                            </h3>
                            {Object.keys(engagement?.scrollByPage || {}).length === 0 ? (
                                <p className="text-text-muted text-sm">No scroll data yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(engagement?.scrollByPage || {}).map(([page, data]) => (
                                        <div key={page}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-text-secondary text-sm font-mono">{page}</span>
                                                <span className="text-text-muted text-xs">{data.total} sessions</span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[25, 50, 75, 100].map((milestone) => {
                                                    const pct = data.total > 0 ? Math.round((data[milestone] / data.total) * 100) : 0;
                                                    return (
                                                        <div key={milestone} className="text-center rounded-lg bg-surface-light/50 px-2 py-3">
                                                            <div className="text-primary-light font-bold text-lg">{pct}%</div>
                                                            <div className="text-text-muted text-xs">reached {milestone}%</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Project Clicks */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🗂️</span>
                                    Project Card Clicks
                                </h3>
                                <span className="text-text-muted text-xs">Total: {engagement?.projectClicksTotal || 0}</span>
                            </div>
                            {Object.keys(engagement?.projectClicksByTitle || {}).length === 0 ? (
                                <p className="text-text-muted text-sm">No project card clicks yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {Object.entries(engagement?.projectClicksByTitle || {})
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([title, count]) => {
                                            const maxCount = Math.max(1, ...Object.values(engagement?.projectClicksByTitle || {}));
                                            const pct = (count / maxCount) * 100;
                                            return (
                                                <div key={title}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-text-secondary text-sm">{title}</span>
                                                        <span className="text-text-primary text-sm font-bold">{count}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.8 }}
                                                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* Resume Downloads */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-sm">📄</span>
                                    Resume Downloads
                                </h3>
                                <span className="text-text-muted text-xs">Total: {engagement?.resumeDownloadsTotal || 0}</span>
                            </div>
                            {Object.keys(engagement?.resumeDownloadsByPage || {}).length === 0 ? (
                                <p className="text-text-muted text-sm">No resume downloads tracked yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {Object.entries(engagement?.resumeDownloadsByPage || {})
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([page, count]) => (
                                            <div key={page} className="flex items-center justify-between rounded-lg bg-surface-light/50 px-3 py-2">
                                                <span className="text-text-secondary text-sm font-mono">{page}</span>
                                                <span className="text-primary-light text-sm font-semibold">{count}</span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* GitHub Clicks (from outbound summary) */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">⚙️</span>
                                GitHub Link Clicks
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-surface-light/50 px-6 py-4 text-center">
                                    <div className="text-text-primary font-bold text-3xl">{trackedGithubClicks}</div>
                                    <div className="text-text-muted text-xs mt-1">total clicks</div>
                                </div>
                                {trackedGithubClicks === 0 && (
                                    <p className="text-text-muted text-sm">No GitHub link clicks yet. Add a GitHub link to trigger tracking.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ===== HISTORY TAB ===== */}
                {activeTab === "history" && (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-surface-light flex items-center justify-between">
                            <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📋</span>
                                Visitor History Log (IP Folders)
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-medium">
                                    {groupedHistory.length} IP folders
                                </span>
                                <button
                                    onClick={() => handleClearVisitLog().catch(() => {})}
                                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 space-y-4">
                            {groupedHistory.slice(0, 100).map((folder, i) => {
                                const expanded = Boolean(openIpFolders[folder.ip]);
                                return (
                                    <div key={folder.ip} className="rounded-xl border border-surface-light/60 bg-surface-light/20 overflow-hidden">
                                        <button
                                            onClick={() => toggleIpFolder(folder.ip)}
                                            className="w-full px-4 py-3 sm:px-5 sm:py-4 flex items-start sm:items-center justify-between gap-3 hover:bg-primary/5 transition-colors text-left"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-base">{expanded ? "📂" : "📁"}</span>
                                                    <span className="text-text-primary font-mono text-sm break-all">{folder.ip}</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-light text-xs font-medium">
                                                        {folder.count} visits
                                                    </span>
                                                </div>
                                                <div className="mt-1.5 text-xs text-text-muted flex flex-wrap gap-x-4 gap-y-1">
                                                    <span>Last: {folder.lastVisitAt ? new Date(folder.lastVisitAt).toLocaleString() : "Unknown"}</span>
                                                    <span>Browser: {folder.browsers.join(", ") || "Unknown"}</span>
                                                    <span>Device: {folder.devices.join(", ") || "Unknown"}</span>
                                                    <span>
                                                        Location: {loadingIpLocations[folder.ip] ? "Loading..." : getLocationLabel(folder.ip)}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-[11px] text-text-muted truncate">
                                                    Pages: {folder.pages.join(", ") || "Unknown"}
                                                </div>
                                            </div>
                                            <span className="text-text-muted text-xs font-medium shrink-0">{expanded ? "Hide" : "Open"}</span>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {expanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="border-t border-surface-light/60"
                                                >
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b border-surface-light/60 bg-surface-light/40">
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">#</th>
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">Page</th>
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">Visit Time</th>
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">Browser</th>
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">Device</th>
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">Referrer</th>
                                                                    <th className="text-left px-4 py-2 text-text-muted text-[11px] uppercase tracking-wider">Delete</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {folder.visits.map((visit, visitIndex) => (
                                                                    <tr key={visit.id || `${folder.ip}-${visitIndex}`} className="border-b border-surface-light/40 last:border-0">
                                                                        <td className="px-4 py-2.5 text-text-muted font-mono">{visitIndex + 1}</td>
                                                                        <td className="px-4 py-2.5">
                                                                            <span className="text-primary-light font-mono text-xs px-2 py-0.5 rounded bg-primary/10">
                                                                                {visit.page}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2.5 text-text-secondary">{new Date(visit.at).toLocaleString()}</td>
                                                                        <td className="px-4 py-2.5 text-text-muted">{getBrowserName(visit.userAgent)}</td>
                                                                        <td className="px-4 py-2.5 text-text-muted">{getDeviceType(visit.userAgent, visit.screenWidth)}</td>
                                                                        <td className="px-4 py-2.5 text-text-muted max-w-[260px] truncate" title={visit.referrer || "Direct / Unknown"}>
                                                                            {visit.referrer || "Direct / Unknown"}
                                                                        </td>
                                                                        <td className="px-4 py-2.5">
                                                                            <button
                                                                                onClick={() => handleDeleteVisit(visit.id).catch(() => {})}
                                                                                className="px-2 py-1 rounded text-[11px] border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            {groupedHistory.length === 0 && (
                                <div className="px-6 py-16 text-center">
                                    <span className="text-5xl block mb-3">🔍</span>
                                    <p className="text-text-muted">No visits recorded yet. Visit pages in the portfolio to see data here.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ===== SOCIAL STATS TAB ===== */}
                {activeTab === "social" && (
                    <motion.div
                        key="social"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* LinkedIn */}
                        <div className="glass rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-light" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-lg text-text-primary">LinkedIn</h3>
                                        <p className="text-text-muted text-xs">Professional network stats</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditingLinkedin(!editingLinkedin)}
                                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${editingLinkedin
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                        : "glass text-text-secondary hover:text-primary-light hover:border-primary/30"
                                        }`}
                                >
                                    {editingLinkedin ? "Cancel" : "✏️ Edit"}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {editingLinkedin ? (
                                    <motion.div key="edit-li" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { label: "Profile Views", key: "views" },
                                                { label: "Followers", key: "followers" },
                                            ].map((field) => (
                                                <div key={field.key}>
                                                    <label className="block text-text-muted text-xs mb-1.5 font-medium">{field.label}</label>
                                                    <input
                                                        type="number"
                                                        value={linkedin[field.key]}
                                                        onChange={(e) => setLinkedin({ ...linkedin, [field.key]: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-light text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                                                    />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-text-muted text-xs mb-1.5 font-medium">Profile Clicks (Auto)</label>
                                                <input
                                                    type="number"
                                                    value={trackedLinkedinClicks}
                                                    disabled
                                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-surface-light text-text-muted text-sm cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLinkedinSave}
                                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            💾 Save Stats
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="view-li" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: "Profile Views", value: linkedin.views, icon: "👁️" },
                                            { label: "Profile Clicks (Tracked)", value: trackedLinkedinClicks, icon: "🖱️" },
                                            { label: "Followers", value: linkedin.followers, icon: "👥" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-surface-light/50 rounded-xl p-5 text-center hover:bg-surface-light transition-colors">
                                                <span className="text-xl block mb-2">{stat.icon}</span>
                                                <p className="text-primary-light font-display font-bold text-3xl">{stat.value}</p>
                                                <p className="text-text-muted text-xs mt-1.5">{stat.label}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Behance */}
                        <div className="glass rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-primary" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-light" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-lg text-text-primary">Behance</h3>
                                        <p className="text-text-muted text-xs">Creative portfolio stats</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditingBehance(!editingBehance)}
                                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${editingBehance
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                        : "glass text-text-secondary hover:text-primary-light hover:border-primary/30"
                                        }`}
                                >
                                    {editingBehance ? "Cancel" : "✏️ Edit"}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {editingBehance ? (
                                    <motion.div key="edit-be" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { label: "Project Views", key: "views" },
                                                { label: "Appreciations", key: "appreciations" },
                                                { label: "Followers", key: "followers" },
                                            ].map((field) => (
                                                <div key={field.key}>
                                                    <label className="block text-text-muted text-xs mb-1.5 font-medium">{field.label}</label>
                                                    <input
                                                        type="number"
                                                        value={behance[field.key]}
                                                        onChange={(e) => setBehance({ ...behance, [field.key]: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-light text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <label className="block text-text-muted text-xs mb-1.5 font-medium">Outbound Clicks (Auto)</label>
                                            <input
                                                type="number"
                                                value={trackedBehanceClicks}
                                                disabled
                                                className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-surface-light/60 border border-surface-light text-text-muted text-sm cursor-not-allowed"
                                            />
                                        </div>
                                        <button
                                            onClick={handleBehanceSave}
                                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            💾 Save Stats
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="view-be" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Project Views", value: behance.views, icon: "👁️" },
                                            { label: "Outbound Clicks (Tracked)", value: trackedBehanceClicks, icon: "🖱️" },
                                            { label: "Appreciations", value: behance.appreciations, icon: "❤️" },
                                            { label: "Followers", value: behance.followers, icon: "👥" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-surface-light/50 rounded-xl p-5 text-center hover:bg-surface-light transition-colors">
                                                <span className="text-xl block mb-2">{stat.icon}</span>
                                                <p className="text-primary-light font-display font-bold text-3xl">{stat.value}</p>
                                                <p className="text-text-muted text-xs mt-1.5">{stat.label}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="glass rounded-xl p-4 text-center">
                            <p className="text-text-muted text-xs flex items-center justify-center gap-2">
                                <span>💡</span>
                                LinkedIn/Behance profile views are external platform data. This dashboard tracks outbound clicks from your portfolio links, not who viewed your LinkedIn profile.
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🧭</span>
                                    Outbound Social Click Tracking
                                </h3>
                                <span className="text-text-muted text-xs">Total tracked: {outboundSummary.total || 0}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                                <div className="bg-surface-light/50 rounded-xl p-4 text-center">
                                    <p className="text-primary-light font-display font-bold text-3xl">{outboundSummary.total || 0}</p>
                                    <p className="text-text-muted text-xs mt-1">All outbound clicks</p>
                                </div>
                                <div className="bg-surface-light/50 rounded-xl p-4 text-center">
                                    <p className="text-primary-light font-display font-bold text-3xl">{outboundSummary.byPlatform?.linkedin || 0}</p>
                                    <p className="text-text-muted text-xs mt-1">LinkedIn clicks</p>
                                </div>
                                <div className="bg-surface-light/50 rounded-xl p-4 text-center">
                                    <p className="text-primary-light font-display font-bold text-3xl">{outboundSummary.byPlatform?.behance || 0}</p>
                                    <p className="text-text-muted text-xs mt-1">Behance clicks</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-surface-light/60 bg-surface-light/20 p-4 mb-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-text-primary font-semibold">Last 7 days</h4>
                                        <p className="text-text-muted text-xs">Tracked outbound clicks from your portfolio</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="flex items-center gap-2 text-text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-primary" />LinkedIn</span>
                                        <span className="flex items-center gap-2 text-text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-secondary" />Behance</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-3 h-40 items-end">
                                    {socialTrend.days.map((day, index) => (
                                        <div key={day.key} className="flex flex-col items-center gap-2 h-full">
                                            <div className="text-[10px] text-text-muted h-3">{day.linkedin + day.behance > 0 ? day.linkedin + day.behance : ""}</div>
                                            <div className="flex items-end justify-center gap-1 w-full flex-1">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max((day.linkedin / socialTrend.maxValue) * 100, day.linkedin ? 8 : 0)}%` }}
                                                    transition={{ duration: 0.45, delay: index * 0.04 }}
                                                    className="w-3 rounded-t-md bg-primary"
                                                    title={`${day.label}: ${day.linkedin} LinkedIn clicks`}
                                                />
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max((day.behance / socialTrend.maxValue) * 100, day.behance ? 8 : 0)}%` }}
                                                    transition={{ duration: 0.45, delay: index * 0.04 + 0.05 }}
                                                    className="w-3 rounded-t-md bg-secondary"
                                                    title={`${day.label}: ${day.behance} Behance clicks`}
                                                />
                                            </div>
                                            <span className="text-[10px] text-text-muted whitespace-nowrap">{day.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-surface-light/60">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-surface-light/40 border-b border-surface-light/60">
                                            <th className="text-left px-4 py-2.5 text-text-muted text-xs uppercase tracking-wider">Platform</th>
                                            <th className="text-left px-4 py-2.5 text-text-muted text-xs uppercase tracking-wider">Source</th>
                                            <th className="text-left px-4 py-2.5 text-text-muted text-xs uppercase tracking-wider">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ensureRecordArray(outboundHistory).slice(0, 20).map((entry, entryIndex) => (
                                            <tr key={entry.id || `${entry.platform || "unknown"}-${entry.at || entryIndex}`} className="border-b border-surface-light/40 last:border-0">
                                                <td className="px-4 py-2.5 text-text-primary capitalize">{entry.platform || "unknown"}</td>
                                                <td className="px-4 py-2.5 text-text-secondary">{entry.sourcePath || "unknown"}</td>
                                                <td className="px-4 py-2.5 text-text-muted">{toSafeDate(entry.at)?.toLocaleString() || "Unknown"}</td>
                                            </tr>
                                        ))}
                                        {ensureRecordArray(outboundHistory).length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-6 text-center text-text-muted">No outbound social clicks tracked yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "messages" && (
                    <motion.div
                        key="messages"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-surface-light flex items-center justify-between">
                            <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">✉️</span>
                                Contact Messages (IP Folders)
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-medium">
                                {groupedMessages.length} IP folders
                            </span>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4">
                            {groupedMessages.length === 0 ? (
                                <div className="px-6 py-16 text-center text-text-muted">No messages yet.</div>
                            ) : (
                                groupedMessages.slice(0, 100).map((folder) => {
                                    const expanded = Boolean(openMessageIpFolders[folder.ip]);
                                    return (
                                        <div key={folder.ip} className="rounded-xl border border-surface-light/60 bg-surface-light/20 overflow-hidden">
                                            <button
                                                onClick={() => toggleMessageFolder(folder.ip)}
                                                className="w-full px-4 py-3 sm:px-5 sm:py-4 flex items-start sm:items-center justify-between gap-3 hover:bg-primary/5 transition-colors text-left"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-base">{expanded ? "📂" : "📁"}</span>
                                                        <span className="text-text-primary font-mono text-sm break-all">{folder.ip}</span>
                                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-light text-xs font-medium">
                                                            {folder.count} messages
                                                        </span>
                                                    </div>
                                                    <div className="mt-1.5 text-xs text-text-muted flex flex-wrap gap-x-4 gap-y-1">
                                                        <span>Last: {folder.lastMessageAt ? new Date(folder.lastMessageAt).toLocaleString() : "Unknown"}</span>
                                                        <span>Emails: {folder.senders.join(", ") || "Unknown"}</span>
                                                        <span>
                                                            Location: {loadingIpLocations[folder.ip] ? "Loading..." : getLocationLabel(folder.ip)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-text-muted text-xs font-medium shrink-0">{expanded ? "Hide" : "Open"}</span>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {expanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="border-t border-surface-light/60"
                                                    >
                                                        <div className="divide-y divide-surface-light/40">
                                                            {folder.messages.map((msg, messageIndex) => (
                                                                <div key={msg.id || `${folder.ip}-${msg.email || "message"}-${messageIndex}`} className="px-5 py-4">
                                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                        <span className="text-text-primary font-semibold">{msg.name || "Unknown"}</span>
                                                                        <a href={`mailto:${msg.email || ""}`} className="text-primary-light text-sm">{msg.email || "unknown"}</a>
                                                                        <span className="text-text-muted text-xs">{toSafeDate(msg.createdAt)?.toLocaleString() || "Unknown"}</span>
                                                                        <span className="text-text-muted text-xs font-mono">{msg.sourcePath || "unknown"}</span>
                                                                    </div>
                                                                    <p className="text-text-secondary text-sm whitespace-pre-wrap">{msg.message || ""}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}
