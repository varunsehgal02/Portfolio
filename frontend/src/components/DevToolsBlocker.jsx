"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;

        let blocked = false;
        let consoleTimer;
        let devtoolsCheckTimer;

        const blockEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === "function") {
                e.stopImmediatePropagation();
            }
            return false;
        };

        const lockPage = () => {
            if (blocked) return;
            blocked = true;

            if (consoleTimer) clearInterval(consoleTimer);
            if (devtoolsCheckTimer) clearInterval(devtoolsCheckTimer);

            const html = document.documentElement;
            const body = document.body;
            html.innerHTML = "";
            body.innerHTML = "";

            Object.assign(body.style, {
                margin: "0",
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#05070f",
                color: "#e2e8f0",
                fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                textAlign: "center",
                padding: "24px",
            });

            const msg = document.createElement("div");
            msg.innerHTML = "<h1 style=\"margin:0 0 12px;font-size:28px\">Session Blocked</h1><p style=\"margin:0;opacity:.9;font-size:16px\">Developer tools are disabled on this page.</p>";
            body.appendChild(msg);
        };

        // Break out if opened inside an iframe.
        if (window.top !== window.self) {
            try {
                window.top.location = window.self.location;
            } catch {
                lockPage();
            }
        }

        // Block right-click and opening links in new tabs from the menu.
        const handleContextMenu = (e) => blockEvent(e);

        // Block common inspect/devtools/view-source/save shortcuts.
        const handleKeyDown = (e) => {
            const key = (e.key || "").toLowerCase();
            const ctrlOrMeta = e.ctrlKey || e.metaKey;

            if (key === "f12") return blockEvent(e);
            if ((ctrlOrMeta && e.shiftKey && ["i", "j", "c", "k"].includes(key))) return blockEvent(e);
            if ((ctrlOrMeta && ["u", "s", "p"].includes(key))) return blockEvent(e);
            if (e.altKey && e.metaKey && ["i", "j", "c"].includes(key)) return blockEvent(e);

            return true;
        };

        // Disable selection/drag/copy outside form elements.
        const handleSelectStart = (e) => {
            const tag = e.target?.tagName;
            if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return true;
            return blockEvent(e);
        };

        const handleDragStart = (e) => blockEvent(e);

        const handleCopy = (e) => {
            const tag = e.target?.tagName;
            if (["INPUT", "TEXTAREA"].includes(tag)) return true;
            return blockEvent(e);
        };

        // Heuristic checks for opened DevTools.
        const hasDevToolsByWindowDiff = () => {
            const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
            const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
            return widthDiff > 160 || heightDiff > 160;
        };

        const hasDevToolsByDebuggerDelay = () => {
            const start = performance.now();
            // eslint-disable-next-line no-debugger
            debugger;
            return performance.now() - start > 120;
        };

        const detectDevTools = () => {
            if (blocked) return;
            if (hasDevToolsByWindowDiff() || hasDevToolsByDebuggerDelay()) {
                lockPage();
            }
        };

        // Console flood warning and repeated checks.
        consoleTimer = setInterval(() => {
            if (blocked) return;
            console.clear();
            console.log("%cSTOP", "color:red;font-size:42px;font-weight:800;");
            console.log("%cThis page blocks developer tools in production.", "font-size:14px;color:#9ca3af;");
        }, 1800);

        devtoolsCheckTimer = setInterval(detectDevTools, 1000);

        document.addEventListener("contextmenu", handleContextMenu, true);
        document.addEventListener("keydown", handleKeyDown, true);
        document.addEventListener("selectstart", handleSelectStart, true);
        document.addEventListener("dragstart", handleDragStart, true);
        document.addEventListener("copy", handleCopy, true);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("selectstart", handleSelectStart, true);
            document.removeEventListener("dragstart", handleDragStart, true);
            document.removeEventListener("copy", handleCopy, true);
            if (consoleTimer) clearInterval(consoleTimer);
            if (devtoolsCheckTimer) clearInterval(devtoolsCheckTimer);
        };
    }, []);

    return null;
}
