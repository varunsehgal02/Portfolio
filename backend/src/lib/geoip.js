const { isIP } = require("net");

function toPositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

function isPrivateIpv4(ip) {
  return (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("127.") ||
    ip.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

function isPrivateIpv6(ip) {
  const lower = ip.toLowerCase();
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80");
}

function shouldLookupIp(ip) {
  if (!ip || ip === "unknown") return false;
  if (ip.includes("::ffff:")) {
    const ipv4 = ip.split("::ffff:")[1];
    return shouldLookupIp(ipv4);
  }

  const family = isIP(ip);
  if (!family) return false;

  if (family === 4) return !isPrivateIpv4(ip);
  if (family === 6) return !isPrivateIpv6(ip);
  return false;
}

function normalizeGeoData(ip, data) {
  if (!data || typeof data !== "object") return null;

  return {
    ip,
    city: data.city || "",
    region: data.region || "",
    country: data.country || "",
    countryCode: data.countryCode || "",
    latitude: typeof data.latitude === "number" ? data.latitude : null,
    longitude: typeof data.longitude === "number" ? data.longitude : null,
    timezone: data.timezone || "",
    isp: data.isp || "",
    cachedAt: new Date().toISOString(),
    source: data.source || "unknown",
  };
}

async function fetchJson(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function lookupWithIpWho(ip, timeoutMs) {
  const data = await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}`, timeoutMs);
  if (!data || data.success === false) return null;

  return normalizeGeoData(ip, {
    city: data.city,
    region: data.region,
    country: data.country,
    countryCode: data.country_code,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone?.id,
    isp: data.connection?.isp || data.connection?.org,
    source: "ipwho.is",
  });
}

async function lookupWithIpApiCo(ip, timeoutMs) {
  const data = await fetchJson(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, timeoutMs);
  if (!data || data.error) return null;

  return normalizeGeoData(ip, {
    city: data.city,
    region: data.region,
    country: data.country_name,
    countryCode: data.country_code,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    timezone: data.timezone,
    isp: data.org,
    source: "ipapi.co",
  });
}

async function lookupGeoByIp(ip) {
  if (!shouldLookupIp(ip)) {
    return null;
  }

  const timeoutMs = toPositiveInt(process.env.GEOLOOKUP_TIMEOUT_MS, 3000);

  const providers = [lookupWithIpWho, lookupWithIpApiCo];

  for (const provider of providers) {
    const result = await provider(ip, timeoutMs);
    if (result && (result.city || result.region || result.country || result.isp)) {
      return result;
    }
  }

  return null;
}

module.exports = {
  lookupGeoByIp,
};