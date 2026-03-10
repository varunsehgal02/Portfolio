const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const contentRouter = require("./routes/content");
const analyticsRouter = require("./routes/analytics");
const contactRouter = require("./routes/contact");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const rawOrigins = process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001";
const allowedOrigins = rawOrigins.split(",").map((s) => s.trim()).filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/contact", contactRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
