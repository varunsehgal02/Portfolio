const express = require("express");
const { z } = require("zod");
const { readStore, writeStore } = require("../lib/store");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const pageViewSchema = z.object({
  page: z.string().min(1),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  screenWidth: z.number().optional(),
});

const aboutPopupSchema = z.object({
  cardTitle: z.string().min(1),
});

router.post("/page-view", async (req, res) => {
  const parsed = pageViewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid page-view payload" });
  }

  const store = await readStore();
  store.analytics = store.analytics || { pageViews: [], aboutPopupOpens: [] };
  store.analytics.pageViews = store.analytics.pageViews || [];
  store.analytics.pageViews.push({
    id: Date.now(),
    page: parsed.data.page,
    userAgent: parsed.data.userAgent || "",
    referrer: parsed.data.referrer || "",
    screenWidth: parsed.data.screenWidth || 0,
    at: new Date().toISOString(),
  });
  await writeStore(store);

  return res.json({ ok: true });
});

router.get("/history", requireAuth, async (_req, res) => {
  const store = await readStore();
  const analytics = store.analytics || { pageViews: [] };
  const history = (analytics.pageViews || []).slice().reverse();
  return res.json(history);
});

router.post("/about-popup", async (req, res) => {
  const parsed = aboutPopupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid about-popup payload" });
  }

  const store = await readStore();
  store.analytics = store.analytics || { pageViews: [], aboutPopupOpens: [] };
  store.analytics.aboutPopupOpens = store.analytics.aboutPopupOpens || [];
  store.analytics.aboutPopupOpens.push({
    cardTitle: parsed.data.cardTitle,
    at: new Date().toISOString(),
  });
  await writeStore(store);

  return res.json({ ok: true });
});

router.get("/summary", requireAuth, async (_req, res) => {
  const store = await readStore();
  const analytics = store.analytics || { pageViews: [], aboutPopupOpens: [] };

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
    byPage,
    byCard,
  });
});

module.exports = router;
