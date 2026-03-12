const nodemailer = require("nodemailer");

let cachedTransporter = null;
let warnedMissingMailerConfig = false;
let warnedMissingResendConfig = false;

function parsePort(value, fallback) {
  const port = Number(value);
  if (!Number.isFinite(port) || port <= 0) return fallback;
  return Math.floor(port);
}

function toBool(value, fallback = false) {
  if (typeof value !== "string") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = parsePort(process.env.SMTP_PORT, 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: toBool(process.env.SMTP_SECURE, port === 465),
    connectionTimeout: parsePort(process.env.SMTP_CONNECTION_TIMEOUT_MS, 10000),
    greetingTimeout: parsePort(process.env.SMTP_GREETING_TIMEOUT_MS, 10000),
    socketTimeout: parsePort(process.env.SMTP_SOCKET_TIMEOUT_MS, 20000),
    auth: {
      user,
      pass,
    },
  };
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const config = getMailerConfig();
  if (!config) {
    if (!warnedMissingMailerConfig) {
      warnedMissingMailerConfig = true;
      console.warn("[mailer] SMTP is not configured. Contact emails are disabled.");
    }
    return null;
  }

  cachedTransporter = nodemailer.createTransport(config);
  return cachedTransporter;
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = process.env.CONTACT_NOTIFY_TO || process.env.SMTP_USER;

  if (!apiKey || !from || !to) {
    return null;
  }

  return { apiKey, from, to };
}

async function sendWithResend(entry) {
  const config = getResendConfig();
  if (!config) {
    if (!warnedMissingResendConfig && process.env.RESEND_API_KEY) {
      warnedMissingResendConfig = true;
      console.warn("[mailer] RESEND_API_KEY is set but RESEND_FROM_EMAIL/CONTACT_NOTIFY_TO is missing.");
    }
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: entry.email,
      subject: `New portfolio contact from ${entry.name}`,
      text: [
        "You received a new contact form submission:",
        `Name: ${entry.name}`,
        `Email: ${entry.email}`,
        `IP: ${entry.ip || "unknown"}`,
        `Source: ${entry.sourcePath || "unknown"}`,
        `Submitted: ${entry.createdAt}`,
        "",
        "Message:",
        entry.message,
      ].join("\n"),
      html: `
        <h2>New portfolio contact submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(entry.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(entry.email)}</p>
        <p><strong>IP:</strong> ${escapeHtml(entry.ip || "unknown")}</p>
        <p><strong>Source:</strong> ${escapeHtml(entry.sourcePath || "unknown")}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(entry.createdAt)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(entry.message).replaceAll("\n", "<br />")}</p>
      `,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${bodyText}`);
  }

  return true;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendContactNotification(entry) {
  if (process.env.RESEND_API_KEY) {
    return sendWithResend(entry);
  }

  const transporter = getTransporter();
  if (!transporter) {
    return false;
  }

  const to = process.env.CONTACT_NOTIFY_TO || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    replyTo: entry.email,
    subject: `New portfolio contact from ${entry.name}`,
    text: [
      "You received a new contact form submission:",
      `Name: ${entry.name}`,
      `Email: ${entry.email}`,
      `IP: ${entry.ip || "unknown"}`,
      `Source: ${entry.sourcePath || "unknown"}`,
      `Submitted: ${entry.createdAt}`,
      "",
      "Message:",
      entry.message,
    ].join("\n"),
    html: `
      <h2>New portfolio contact submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(entry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(entry.email)}</p>
      <p><strong>IP:</strong> ${escapeHtml(entry.ip || "unknown")}</p>
      <p><strong>Source:</strong> ${escapeHtml(entry.sourcePath || "unknown")}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(entry.createdAt)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(entry.message).replaceAll("\n", "<br />")}</p>
    `,
  });

  return true;
}

module.exports = {
  sendContactNotification,
};