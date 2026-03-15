"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackTimeOnPage, trackScrollDepth } from "@/lib/analytics";

const SKIP_PATHS = new Set(["/monitor", "/edit"]);
const SCROLL_MILESTONES = [25, 50, 75, 100];

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const enterTimeRef = useRef(null);
    const reportedDepthsRef = useRef(new Set());

    useEffect(() => {
        if (SKIP_PATHS.has(pathname)) return;
        trackPageView(pathname).catch(() => {});

        // Reset per-page state
        enterTimeRef.current = Date.now();
        reportedDepthsRef.current = new Set();

        function getScrollPercent() {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            if (total <= 0) return 100;
            return Math.min(100, Math.round((scrolled / total) * 100));
        }

        function handleScroll() {
            const pct = getScrollPercent();
            for (const milestone of SCROLL_MILESTONES) {
                if (pct >= milestone && !reportedDepthsRef.current.has(milestone)) {
                    reportedDepthsRef.current.add(milestone);
                    trackScrollDepth(pathname, milestone);
                }
            }
        }

        function sendTimeOnPage() {
            if (!enterTimeRef.current) return;
            const seconds = Math.round((Date.now() - enterTimeRef.current) / 1000);
            if (seconds >= 2) trackTimeOnPage(pathname, seconds);
            enterTimeRef.current = null;
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "hidden") sendTimeOnPage();
            else enterTimeRef.current = Date.now();
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            sendTimeOnPage();
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [pathname]);

    return null;
}
