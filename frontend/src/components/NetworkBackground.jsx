"use client";

import { useEffect, useRef } from "react";

export default function NetworkBackground({ className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const pointer = { x: -1000, y: -1000, active: false };
        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

        let width = 0;
        let height = 0;
        let rafId = 0;

        const nodes = [];
        const NODE_COUNT = 70;
        const MAX_LINK_DISTANCE = 160;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (!nodes.length) {
                for (let i = 0; i < NODE_COUNT; i += 1) {
                    nodes.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.8,
                        vy: (Math.random() - 0.5) * 0.8,
                        r: Math.random() * 1.8 + 0.7,
                    });
                }
            }
        };

        const onMove = (e) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.active = true;
        };

        const onLeave = () => {
            pointer.active = false;
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "rgba(8, 15, 40, 0.55)";
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < nodes.length; i += 1) {
                const n = nodes[i];

                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                if (pointer.active && !isTouchDevice) {
                    const dx = pointer.x - n.x;
                    const dy = pointer.y - n.y;
                    const d2 = dx * dx + dy * dy;
                    const r = 160;

                    if (d2 < r * r) {
                        const dist = Math.max(Math.sqrt(d2), 0.001);
                        const force = (1 - dist / r) * 0.025;
                        n.vx += (dx / dist) * force;
                        n.vy += (dy / dist) * force;
                    }
                }

                // Keep autonomous movement alive at all times.
                n.vx += (Math.random() - 0.5) * 0.002;
                n.vy += (Math.random() - 0.5) * 0.002;

                const speed = Math.hypot(n.vx, n.vy);
                const minSpeed = 0.16;
                const maxSpeed = 0.95;

                if (speed < minSpeed) {
                    const angle = Math.random() * Math.PI * 2;
                    n.vx = Math.cos(angle) * minSpeed;
                    n.vy = Math.sin(angle) * minSpeed;
                } else if (speed > maxSpeed) {
                    const ratio = maxSpeed / speed;
                    n.vx *= ratio;
                    n.vy *= ratio;
                }

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(125, 211, 252, 0.9)";
                ctx.fill();
            }

            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < MAX_LINK_DISTANCE) {
                        const alpha = (1 - dist / MAX_LINK_DISTANCE) * 0.38;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            if (pointer.active && !isTouchDevice) {
                const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
                grad.addColorStop(0, "rgba(59,130,246,0.18)");
                grad.addColorStop(1, "rgba(59,130,246,0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(pointer.x, pointer.y, 260, 0, Math.PI * 2);
                ctx.fill();
            }

            rafId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        />
    );
}
