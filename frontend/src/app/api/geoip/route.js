import { NextResponse } from "next/server";
import { isIP } from "net";

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
        return shouldLookupIp(ip.split("::ffff:")[1]);
    }

    const family = isIP(ip);
    if (!family) return false;
    if (family === 4) return !isPrivateIpv4(ip);
    if (family === 6) return !isPrivateIpv6(ip);
    return false;
}

async function fetchJson(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(url, {
            method: "GET",
            signal: controller.signal,
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

function normalize(ip, data) {
    if (!data) return null;

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
        source: data.source || "unknown",
    };
}

async function lookupIpWho(ip) {
    const data = await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}`);
    if (!data || data.success === false) return null;

    return normalize(ip, {
        city: data.city,
        region: data.region,
        country: data.country,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone?.id,
        isp: data.connection?.isp || data.connection?.org,
        source: "ipwho.is(proxy)",
    });
}

async function lookupIpApi(ip) {
    const data = await fetchJson(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
    if (!data || data.error) return null;

    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);

    return normalize(ip, {
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        latitude: Number.isFinite(latitude) ? latitude : null,
        longitude: Number.isFinite(longitude) ? longitude : null,
        timezone: data.timezone,
        isp: data.org,
        source: "ipapi.co(proxy)",
    });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ip = (searchParams.get("ip") || "").trim();

    if (!ip) {
        return NextResponse.json({ error: "Missing ip query parameter" }, { status: 400 });
    }

    if (!shouldLookupIp(ip)) {
        return NextResponse.json({ geolocation: null });
    }

    const providers = [lookupIpWho, lookupIpApi];

    for (const provider of providers) {
        const geolocation = await provider(ip);
        if (geolocation && (geolocation.city || geolocation.region || geolocation.country || geolocation.isp)) {
            return NextResponse.json({ geolocation });
        }
    }

    return NextResponse.json({ geolocation: null });
}