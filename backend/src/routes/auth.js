const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const router = express.Router();

const loginSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(1),
});

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  const { id, password } = parsed.data;
  const expectedId = process.env.ADMIN_ID || "varun";
  const expectedPassword = process.env.ADMIN_PASSWORD || "test";

  if (id !== expectedId || password !== expectedPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  return res.json({ token, user: { id, role: "admin" } });
});

module.exports = router;
