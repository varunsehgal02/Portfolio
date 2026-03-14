const fs = require("fs/promises");
const path = require("path");

const STORE_PATH = path.join(__dirname, "../../data/store.json");
let writeQueue = Promise.resolve();

const DEFAULT_STORE = {
  content: {},
  contacts: [],
  analytics: {
    pageViews: [],
    aboutPopupOpens: [],
    outboundClicks: [],
    ipGeoCache: {},
  },
};

function normalizeStore(input) {
  const source = input && typeof input === "object" ? input : {};
  const analytics = source.analytics && typeof source.analytics === "object" ? source.analytics : {};

  return {
    content: source.content && typeof source.content === "object" ? source.content : {},
    contacts: Array.isArray(source.contacts) ? source.contacts : [],
    analytics: {
      pageViews: Array.isArray(analytics.pageViews) ? analytics.pageViews : [],
      aboutPopupOpens: Array.isArray(analytics.aboutPopupOpens) ? analytics.aboutPopupOpens : [],
      outboundClicks: Array.isArray(analytics.outboundClicks) ? analytics.outboundClicks : [],
      ipGeoCache: analytics.ipGeoCache && typeof analytics.ipGeoCache === "object" ? analytics.ipGeoCache : {},
    },
  };
}

async function ensureStore() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
}

async function readStoreFromDisk() {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw || "{}");
    return normalizeStore(parsed);
  } catch {
    return normalizeStore(DEFAULT_STORE);
  }
}

async function persistStore(nextStore) {
  const normalized = normalizeStore(nextStore);
  const tempPath = `${STORE_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(normalized, null, 2), "utf8");
  await fs.rename(tempPath, STORE_PATH);
}

async function readStore() {
  await writeQueue.catch(() => {});
  return readStoreFromDisk();
}

async function writeStore(nextStore) {
  writeQueue = writeQueue.catch(() => {}).then(() => persistStore(nextStore));
  await writeQueue;
}

async function updateStore(mutator) {
  let result;

  writeQueue = writeQueue.catch(() => {}).then(async () => {
    const store = await readStoreFromDisk();
    result = await mutator(store);
    await persistStore(store);
  });

  await writeQueue;
  return result;
}

module.exports = {
  readStore,
  writeStore,
  updateStore,
};
