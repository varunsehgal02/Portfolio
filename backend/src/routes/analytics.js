const express = require("express");
const { z } = require("zod");
const { readStore, updateStore } = require("../lib/store");
const { requireAuth } = require("../middleware/auth");
const { lookupGeoByIp } = require("../lib/geoip");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).split(",")[0].trim();
  }

  return req.ip || "";
}

function ensureAnalytics(store) {
  store.analytics = store.analytics || {};
  store.analytics.pageViews = store.analytics.pageViews || [];
  store.analytics.aboutPopupOpens = store.analytics.aboutPopupOpens || [];
  store.analytics.outboundClicks = store.analytics.outboundClicks || [];
  store.analytics.ipGeoCache = store.analytics.ipGeoCache || {};
  store.analytics.timeOnPage = store.analytics.timeOnPage || [];
  store.analytics.scrollDepths = store.analytics.scrollDepths || [];
  store.analytics.projectClicks = store.analytics.projectClicks || [];
  store.analytics.resumeDownloads = store.analytics.resumeDownloads || [];
  return store.analytics;
}

function parseDeviceType(userAgent, screenWidth) {
  const ua = String(userAgent || "").toLowerCase();
  if (ua.includes("ipad") || ua.includes("tablet")) return "Tablet";
  if (ua.includes("mobi") || Number(screenWidth) < 768) return "Mobile";
  return "Desktop";
}

function parseBrowser(userAgent) {
  const ua = String(userAgent || "").toLowerCase();
  if (!ua) return "Unknown";
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome/") && !ua.includes("edg/")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  if (ua.includes("firefox/")) return "Firefox";
  return "Other";
}

const pageViewSchema = z.object({
  page: z.string().min(1),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  screenWidth: z.number().optional(),
});

const timeOnPageSchema = z.object({
  page: z.string().min(1),
  seconds: z.number().min(0).max(3600),
});

const scrollDepthSchema = z.object({
  page: z.string().min(1),
  depth: z.number().int().min(0).max(100),
});

const projectClickSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  sourcePath: z.string().max(200).optional(),
});

const resumeDownloadSchema = z.object({
  sourcePage: z.string().min(1).max(200),
});

const aboutPopupSchema = z.object({
  cardTitle: z.string().min(1),
});

const outboundClickSchema = z.object({
  platform: z.enum(["linkedin", "behance", "github"]),
  url: z.string().url(),
  sourcePath: z.string().min(1).max(200).optional(),
  referrer: z.string().max(1000).optional(),
  userAgent: z.string().max(1000).optional(),
});

router.post("/page-view", async (req, res) => {
  const parsed = pageViewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid page-view payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    const ua = parsed.data.userAgent || "";
    const sw = parsed.data.screenWidth || 0;
    analytics.pageViews.push({
      id: Date.now(),
      page: parsed.data.page,
      userAgent: ua,
      referrer: parsed.data.referrer || "",
      screenWidth: sw,
      browser: parseBrowser(ua),
      deviceType: parseDeviceType(ua, sw),
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.post("/time-on-page", async (req, res) => {
  const parsed = timeOnPageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid time-on-page payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.timeOnPage.push({
      id: Date.now(),
      page: parsed.data.page,
      seconds: parsed.data.seconds,
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.post("/scroll-depth", async (req, res) => {
  const parsed = scrollDepthSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid scroll-depth payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.scrollDepths.push({
      id: Date.now(),
      page: parsed.data.page,
      depth: parsed.data.depth,
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.post("/project-click", async (req, res) => {
  const parsed = projectClickSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid project-click payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.projectClicks.push({
      id: Date.now(),
      title: parsed.data.title,
      slug: parsed.data.slug || "",
      sourcePath: parsed.data.sourcePath || "unknown",
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.post("/resume-download", async (req, res) => {
  const parsed = resumeDownloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid resume-download payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.resumeDownloads.push({
      id: Date.now(),
      sourcePage: parsed.data.sourcePage,
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.delete("/page/:page", requireAuth, async (req, res) => {
  const page = decodeURIComponent(String(req.params.page || "")).trim();
  if (!page) {
    return res.status(400).json({ error: "Missing page parameter" });
  }

  const removed = await updateStore((store) => {
    const analytics = ensureAnalytics(store);

    const beforePageViews = analytics.pageViews.length;
    const beforeTimeOnPage = analytics.timeOnPage.length;
    const beforeScrollDepths = analytics.scrollDepths.length;
    const beforeProjectClicks = analytics.projectClicks.length;
    const beforeResumeDownloads = analytics.resumeDownloads.length;

    analytics.pageViews = analytics.pageViews.filter((row) => row.page !== page);
    analytics.timeOnPage = analytics.timeOnPage.filter((row) => row.page !== page);
    analytics.scrollDepths = analytics.scrollDepths.filter((row) => row.page !== page);
    analytics.projectClicks = analytics.projectClicks.filter((row) => row.sourcePath !== page);
    analytics.resumeDownloads = analytics.resumeDownloads.filter((row) => row.sourcePage !== page);

    return {
      pageViews: beforePageViews - analytics.pageViews.length,
      timeOnPage: beforeTimeOnPage - analytics.timeOnPage.length,
      scrollDepths: beforeScrollDepths - analytics.scrollDepths.length,
      projectClicks: beforeProjectClicks - analytics.projectClicks.length,
      resumeDownloads: beforeResumeDownloads - analytics.resumeDownloads.length,
    };
  });

  return res.json({ ok: true, page, removed });
});

router.delete("/page-view/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid page-view id" });
  }

  const deleted = await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    const before = analytics.pageViews.length;
    analytics.pageViews = analytics.pageViews.filter((row) => Number(row.id) !== id);
    return before !== analytics.pageViews.length;
  });

  if (!deleted) {
    return res.status(404).json({ error: "Page-view entry not found" });
  }

  return res.json({ ok: true, id });
});

router.delete("/all", requireAuth, async (_req, res) => {
  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.pageViews = [];
    analytics.aboutPopupOpens = [];
    analytics.outboundClicks = [];
    analytics.timeOnPage = [];
    analytics.scrollDepths = [];
    analytics.projectClicks = [];
    analytics.resumeDownloads = [];
    analytics.ipGeoCache = {};
  });

  return res.json({ ok: true });
});

router.delete("/history", requireAuth, async (_req, res) => {
  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.pageViews = [];
    analytics.timeOnPage = [];
    analytics.scrollDepths = [];
  });

  return res.json({ ok: true });
});

router.get("/history", requireAuth, async (_req, res) => {
  const store = await readStore();
  const analytics = ensureAnalytics(store);
  const history = (analytics.pageViews || []).slice().reverse();
  return res.json(history);
});

router.post("/about-popup", async (req, res) => {
  const parsed = aboutPopupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid about-popup payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.aboutPopupOpens.push({
      cardTitle: parsed.data.cardTitle,
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.post("/outbound-click", async (req, res) => {
  const parsed = outboundClickSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid outbound-click payload" });
  }

  await updateStore((store) => {
    const analytics = ensureAnalytics(store);
    analytics.outboundClicks.push({
      id: Date.now(),
      platform: parsed.data.platform,
      url: parsed.data.url,
      sourcePath: parsed.data.sourcePath || "unknown",
      referrer: parsed.data.referrer || "",
      userAgent: parsed.data.userAgent || "",
      browser: parseBrowser(parsed.data.userAgent || ""),
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
  });

  return res.json({ ok: true });
});

router.get("/outbound-history", requireAuth, async (req, res) => {
  const platform = typeof req.query.platform === "string" ? req.query.platform.toLowerCase() : "";
  const store = await readStore();
  const analytics = ensureAnalytics(store);

  let rows = (analytics.outboundClicks || []).slice();
  if (platform === "linkedin" || platform === "behance" || platform === "github") {
    rows = rows.filter((row) => row.platform === platform);
  }

  return res.json(rows.reverse());
});

router.get("/outbound-summary", requireAuth, async (_req, res) => {
  const store = await readStore();
  const analytics = ensureAnalytics(store);
  const clicks = analytics.outboundClicks || [];

  const byPlatform = {
    linkedin: 0,
    behance: 0,
    github: 0,
  };

  clicks.forEach((row) => {
    if (row.platform === "linkedin" || row.platform === "behance" || row.platform === "github") {
      byPlatform[row.platform] += 1;
    }
  });

  return res.json({
    total: clicks.length,
    byPlatform,
    recent: clicks.slice(-20).reverse(),
  });
});

router.get("/engagement", requireAuth, async (_req, res) => {
  const store = await readStore();
  const analytics = ensureAnalytics(store);

  // Avg time on page by page
  const timeByPage = {};
  const timeCountByPage = {};
  (analytics.timeOnPage || []).forEach((entry) => {
    const p = entry.page || "unknown";
    timeByPage[p] = (timeByPage[p] || 0) + Number(entry.seconds || 0);
    timeCountByPage[p] = (timeCountByPage[p] || 0) + 1;
  });
  const avgTimeByPage = {};
  Object.keys(timeByPage).forEach((p) => {
    avgTimeByPage[p] = Math.round(timeByPage[p] / timeCountByPage[p]);
  });

  // Max scroll depth distribution across pages
  const scrollByPage = {};
  (analytics.scrollDepths || []).forEach((entry) => {
    const p = entry.page || "unknown";
    if (!scrollByPage[p]) scrollByPage[p] = { 25: 0, 50: 0, 75: 0, 100: 0, total: 0 };
    scrollByPage[p].total += 1;
    if (entry.depth >= 25) scrollByPage[p][25] += 1;
    if (entry.depth >= 50) scrollByPage[p][50] += 1;
    if (entry.depth >= 75) scrollByPage[p][75] += 1;
    if (entry.depth >= 100) scrollByPage[p][100] += 1;
  });

  // Project clicks
  const projectClicksByTitle = {};
  (analytics.projectClicks || []).forEach((entry) => {
    const t = entry.title || "unknown";
    projectClicksByTitle[t] = (projectClicksByTitle[t] || 0) + 1;
  });

  // Device breakdown
  const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
  (analytics.pageViews || []).forEach((entry) => {
    const d = entry.deviceType || "Desktop";
    devices[d] = (devices[d] || 0) + 1;
  });

  // Browser breakdown
  const browsers = {};
  (analytics.pageViews || []).forEach((entry) => {
    const b = entry.browser || "Unknown";
    browsers[b] = (browsers[b] || 0) + 1;
  });

  return res.json({
    avgTimeByPage,
    scrollByPage,
    projectClicksByTitle,
    projectClicksTotal: (analytics.projectClicks || []).length,
    resumeDownloadsTotal: (analytics.resumeDownloads || []).length,
    resumeDownloadsByPage: (analytics.resumeDownloads || []).reduce((acc, r) => {
      const p = r.sourcePage || "unknown";
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {}),
    recentTimeOnPage: (analytics.timeOnPage || []).slice(-50).reverse(),
    recentScrollDepths: (analytics.scrollDepths || []).slice(-50).reverse(),
    recentProjectClicks: (analytics.projectClicks || []).slice(-50).reverse(),
    recentResumeDownloads: (analytics.resumeDownloads || []).slice(-50).reverse(),
    devices,
    browsers,
  });
});

router.get("/visitor", requireAuth, async (req, res) => {
  const ip = typeof req.query.ip === "string" ? req.query.ip.trim() : "";
  if (!ip) {
    return res.status(400).json({ error: "Missing ip query parameter" });
  }

  const store = await readStore();
  const analytics = ensureAnalytics(store);

  const pageViews = (analytics.pageViews || [])
    .filter((row) => (row.ip || "") === ip)
    .slice()
    .reverse();

  const outboundClicks = (analytics.outboundClicks || [])
    .filter((row) => (row.ip || "") === ip)
    .slice()
    .reverse();

  const contacts = (store.contacts || [])
    .filter((row) => (row.ip || "") === ip)
    .slice()
    .reverse();

  const geoLookupEnabled = process.env.GEOLOOKUP_ENABLED !== "false";
  let geolocation = analytics.ipGeoCache[ip] || null;

  if (geoLookupEnabled && !geolocation) {
    geolocation = await lookupGeoByIp(ip);
    if (geolocation) {
      await updateStore((nextStore) => {
        const nextAnalytics = ensureAnalytics(nextStore);
        nextAnalytics.ipGeoCache[ip] = geolocation;
      });
    }
  }

  return res.json({
    ip,
    geolocation,
    summary: {
      pageViews: pageViews.length,
      outboundClicks: outboundClicks.length,
      contacts: contacts.length,
    },
    pageViews: pageViews.slice(0, 100),
    outboundClicks: outboundClicks.slice(0, 100),
    contacts: contacts.slice(0, 100),
    timeOnPage: (analytics.timeOnPage || []).filter((r) => (r.ip || "") === ip).slice().reverse().slice(0, 50),
    scrollDepths: (analytics.scrollDepths || []).filter((r) => (r.ip || "") === ip).slice().reverse().slice(0, 50),
    projectClicks: (analytics.projectClicks || []).filter((r) => (r.ip || "") === ip).slice().reverse().slice(0, 50),
  });
});

router.get("/summary", requireAuth, async (_req, res) => {
  const store = await readStore();
  const analytics = ensureAnalytics(store);

  const byPage = {};
  (analytics.pageViews || []).forEach((entry) => {
    byPage[entry.page] = (byPage[entry.page] || 0) + 1;
  });

  const byCard = {};
  (analytics.aboutPopupOpens || []).forEach((entry) => {
    byCard[entry.cardTitle] = (byCard[entry.cardTitle] || 0) + 1;
  });

  return res.json({
    pageViewsTotal: (analytics.pageViews || []).length,
    aboutPopupOpensTotal: (analytics.aboutPopupOpens || []).length,
    outboundClicksTotal: (analytics.outboundClicks || []).length,
    projectClicksTotal: (analytics.projectClicks || []).length,
    resumeDownloadsTotal: (analytics.resumeDownloads || []).length,
    byPage,
    byCard,
  });
});

module.exports = router;
