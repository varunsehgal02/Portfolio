const express = require("express");
const { z } = require("zod");
const { readStore, writeStore } = require("../lib/store");
const { requireAuth } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimit");
const { sendContactNotification } = require("../lib/mailer");

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

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(5).max(4000),
  sourcePath: z.string().max(200).optional(),
  userAgent: z.string().max(1000).optional(),
  referrer: z.string().max(1000).optional(),
});

router.post("/", contactLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid contact payload" });
  }

  const store = await readStore();
  store.contacts = store.contacts || [];

  const entry = {
    id: Date.now(),
    ...parsed.data,
    ip: getClientIp(req),
    userAgent: parsed.data.userAgent || req.headers["user-agent"] || "",
    referrer: parsed.data.referrer || req.headers.referer || "",
    sourcePath: parsed.data.sourcePath || "unknown",
    createdAt: new Date().toISOString(),
  };

  store.contacts.push(entry);
  await writeStore(store);

  let emailSent = false;
  try {
    emailSent = await sendContactNotification(entry);
  } catch (err) {
    console.error("Contact email notification failed:", err?.message || err);
  }

  return res.json({ ok: true, id: entry.id, emailSent });
});

router.get("/", requireAuth, async (_req, res) => {
  const store = await readStore();
  const contacts = (store.contacts || []).slice().reverse();
  return res.json(contacts);
});

module.exports = router;
