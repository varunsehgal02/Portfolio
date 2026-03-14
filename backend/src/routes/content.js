const express = require("express");
const { z } = require("zod");
const { readStore, updateStore } = require("../lib/store");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const updateSchema = z.object({
  value: z.any(),
});

router.get("/", async (_req, res) => {
  const store = await readStore();
  res.json(store.content || {});
});

router.get("/:key", async (req, res) => {
  const store = await readStore();
  const value = (store.content || {})[req.params.key];
  if (value === undefined) {
    return res.status(404).json({ error: "Content key not found" });
  }
  return res.json({ key: req.params.key, value });
});

router.put("/:key", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid content payload" });
  }

  await updateStore((store) => {
    store.content = store.content || {};
    store.content[req.params.key] = parsed.data.value;
  });

  return res.json({ ok: true, key: req.params.key });
});

router.delete("/:key", requireAuth, async (req, res) => {
  await updateStore((store) => {
    store.content = store.content || {};
    delete store.content[req.params.key];
  });

  return res.json({ ok: true, key: req.params.key });
});

router.delete("/", requireAuth, async (_req, res) => {
  await updateStore((store) => {
    store.content = {};
  });

  return res.json({ ok: true });
});

module.exports = router;
