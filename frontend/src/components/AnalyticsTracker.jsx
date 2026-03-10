"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
        if (pathname === "/monitor" || pathname === "/edit") return;
        trackPageView(pathname).catch(() => {});
    }, [pathname]);

    return null;
}
