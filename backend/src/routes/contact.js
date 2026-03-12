const express = require("express");
const { z } = require("zod");
const { readStore, writeStore } = require("../lib/store");
const { requireAuth } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimit");
const { sendContactNotification } = require("../lib/mailer");

const router = express.Router();

function parseMs(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

function withTimeout(promise, timeoutMs) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const err = new Error("EMAIL_SEND_TIMEOUT");
      reject(err);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

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

  const emailSendTimeoutMs = parseMs(process.env.CONTACT_EMAIL_SEND_TIMEOUT_MS, 5000);
  let emailSent = false;
  let emailStatus = "disabled";
  let emailError = "";

  try {
    emailSent = Boolean(await withTimeout(sendContactNotification(entry), emailSendTimeoutMs));
    emailStatus = emailSent ? "sent" : "disabled";
  } catch (err) {
    const message = String(err?.message || err || "Unknown email error");

    if (message === "EMAIL_SEND_TIMEOUT") {
      emailStatus = "queued";

      // Retry once in background when SMTP is slow.
      sendContactNotification(entry).catch((bgErr) => {
        console.error("Contact email notification failed:", bgErr?.message || bgErr);
      });
    } else {
      emailStatus = "failed";
      emailError = message;
      console.error("Contact email notification failed:", message);
    }
  }

  return res.json({
    ok: true,
    id: entry.id,
    emailSent,
    emailStatus,
    emailError,
  });
});

router.get("/", requireAuth, async (_req, res) => {
  const store = await readStore();
  const contacts = (store.contacts || []).slice().reverse();
  return res.json(contacts);
});

module.exports = router;
