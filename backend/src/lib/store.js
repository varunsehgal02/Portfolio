const fs = require("fs/promises");
const path = require("path");

const STORE_PATH = path.join(__dirname, "../../data/store.json");

const DEFAULT_STORE = {
  content: {},
  contacts: [],
  analytics: {
    pageViews: [],
    aboutPopupOpens: [],
    outboundClicks: [],
  },
};

async function ensureStore() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, "utf8");
  return JSON.parse(raw || "{}");
}

async function writeStore(nextStore) {
  await fs.writeFile(STORE_PATH, JSON.stringify(nextStore, null, 2), "utf8");
}

module.exports = {
  readStore,
  writeStore,
};
