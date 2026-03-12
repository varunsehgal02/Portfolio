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

async function lookupGeoByIp(ip) {
  if (!shouldLookupIp(ip)) {
    return null;
  }

  const timeoutMs = toPositiveInt(process.env.GEOLOOKUP_TIMEOUT_MS, 3000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data || data.success === false) {
      return null;
    }

    return {
      ip,
      city: data.city || "",
      region: data.region || "",
      country: data.country || "",
      countryCode: data.country_code || "",
      latitude: typeof data.latitude === "number" ? data.latitude : null,
      longitude: typeof data.longitude === "number" ? data.longitude : null,
      timezone: data.timezone?.id || "",
      isp: data.connection?.isp || data.connection?.org || "",
      cachedAt: new Date().toISOString(),
      source: "ipwho.is",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  lookupGeoByIp,
};