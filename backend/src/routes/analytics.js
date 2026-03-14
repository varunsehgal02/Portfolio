const express = require("express");
const { z } = require("zod");
const { readStore, updateStore } = require("../lib/store");
const { requireAuth } = require("../middleware/auth");
const { lookupGeoByIp } = require("../lib/geoip");

const router = express.Router();

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
  return store.analytics;
}

const pageViewSchema = z.object({
  page: z.string().min(1),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  screenWidth: z.number().optional(),
});

const aboutPopupSchema = z.object({
  cardTitle: z.string().min(1),
});

const outboundClickSchema = z.object({
  platform: z.enum(["linkedin", "behance"]),
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
    analytics.pageViews.push({
      id: Date.now(),
      page: parsed.data.page,
      userAgent: parsed.data.userAgent || "",
      referrer: parsed.data.referrer || "",
      screenWidth: parsed.data.screenWidth || 0,
      ip: getClientIp(req),
      at: new Date().toISOString(),
    });
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
  if (platform === "linkedin" || platform === "behance") {
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
  };

  clicks.forEach((row) => {
    if (row.platform === "linkedin" || row.platform === "behance") {
      byPlatform[row.platform] += 1;
    }
  });

  return res.json({
    total: clicks.length,
    byPlatform,
    recent: clicks.slice(-20).reverse(),
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
    byPage,
    byCard,
  });
});

module.exports = router;
