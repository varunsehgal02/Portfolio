const nodemailer = require("nodemailer");

let cachedTransporter = null;

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
    auth: {
      user,
      pass,
    },
  };
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const config = getMailerConfig();
  if (!config) return null;

  cachedTransporter = nodemailer.createTransport(config);
  return cachedTransporter;
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
      `Submitted: ${entry.createdAt}`,
      "",
      "Message:",
      entry.message,
    ].join("\n"),
    html: `
      <h2>New portfolio contact submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(entry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(entry.email)}</p>
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