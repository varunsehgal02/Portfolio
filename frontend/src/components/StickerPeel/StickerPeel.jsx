"use client";

import { useEffect, useMemo, useRef, useId } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/draggable";
import "./StickerPeel.css";

gsap.registerPlugin(Draggable);

export default function StickerPeel({
    imageSrc,
    rotate = 18,
    peelBackHoverPct = 28,
    peelBackActivePct = 40,
    peelEasing = "power3.out",
    peelHoverEasing = "power2.out",
    width = 200,
    shadowIntensity = 0.55,
    lightingIntensity = 0.1,
    initialPosition = "center",
    peelDirection = 0,
    showDragHandle = true,
    dragHandleLabel = "Pull Sticker",
    className = "",
}) {
    const containerRef = useRef(null);
    const dragTargetRef = useRef(null);
    const pointLightRef = useRef(null);
    const pointLightFlippedRef = useRef(null);
    const draggableInstanceRef = useRef(null);
    const uid = useId().replace(/[:]/g, "");

    const pointLightId = `pointLight-${uid}`;
    const pointLightFlippedId = `pointLightFlipped-${uid}`;
    const dropShadowId = `dropShadow-${uid}`;
    const expandAndFillId = `expandAndFill-${uid}`;

    useEffect(() => {
        const target = dragTargetRef.current;
        if (!target) return;

        let startX = 0;
        let startY = 0;

        if (initialPosition === "random") {
            startX = Math.round(Math.random() * 120 - 60);
            startY = Math.round(Math.random() * 120 - 60);
        } else if (
            typeof initialPosition === "object" &&
            initialPosition.x !== undefined &&
            initialPosition.y !== undefined
        ) {
            startX = initialPosition.x;
            startY = initialPosition.y;
        }

        gsap.set(target, { x: startX, y: startY });
    }, [initialPosition]);

    useEffect(() => {
        const target = dragTargetRef.current;
        if (!target) return;

        const boundsEl = target.parentNode;
        if (!boundsEl) return;

        const draggable = Draggable.create(target, {
            type: "x,y",
            bounds: boundsEl,
            inertia: true,
            trigger: target.querySelector(".sticker-drag-handle") || target,
            onDrag: function () {
                const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.35);
                gsap.to(target, { rotation: rot, duration: 0.14, ease: "power1.out" });
            },
            onDragEnd: function () {
                gsap.to(target, { rotation: 0, duration: 0.8, ease: "power2.out" });
            },
        });

        draggableInstanceRef.current = draggable[0];

        const handleResize = () => {
            if (!draggableInstanceRef.current) return;
            draggableInstanceRef.current.update();

            const currentX = gsap.getProperty(target, "x");
            const currentY = gsap.getProperty(target, "y");

            const boundsRect = boundsEl.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            const maxX = Math.max(0, boundsRect.width - targetRect.width);
            const maxY = Math.max(0, boundsRect.height - targetRect.height);
            const newX = Math.max(0, Math.min(currentX, maxX));
            const newY = Math.max(0, Math.min(currentY, maxY));

            if (newX !== currentX || newY !== currentY) {
                gsap.to(target, {
                    x: newX,
                    y: newY,
                    duration: 0.25,
                    ease: "power2.out",
                });
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
            draggableInstanceRef.current?.kill();
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateLight = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (pointLightRef.current) {
                gsap.set(pointLightRef.current, { attr: { x, y } });
            }

            const normalizedAngle = Math.abs(peelDirection % 360);
            if (pointLightFlippedRef.current) {
                if (normalizedAngle !== 180) {
                    gsap.set(pointLightFlippedRef.current, {
                        attr: { x, y: rect.height - y },
                    });
                } else {
                    gsap.set(pointLightFlippedRef.current, {
                        attr: { x: -1000, y: -1000 },
                    });
                }
            }
        };

        container.addEventListener("mousemove", updateLight);
        return () => container.removeEventListener("mousemove", updateLight);
    }, [peelDirection]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const touchStart = () => container.classList.add("touch-active");
        const touchEnd = () => container.classList.remove("touch-active");

        container.addEventListener("touchstart", touchStart);
        container.addEventListener("touchend", touchEnd);
        container.addEventListener("touchcancel", touchEnd);

        return () => {
            container.removeEventListener("touchstart", touchStart);
            container.removeEventListener("touchend", touchEnd);
            container.removeEventListener("touchcancel", touchEnd);
        };
    }, []);

    const cssVars = useMemo(
        () => ({
            "--sticker-rotate": `${rotate}deg`,
            "--sticker-p": "10px",
            "--sticker-peelback-hover": `${peelBackHoverPct}%`,
            "--sticker-peelback-active": `${peelBackActivePct}%`,
            "--sticker-peel-easing": peelEasing,
            "--sticker-peel-hover-easing": peelHoverEasing,
            "--sticker-width": `${width}px`,
            "--sticker-shadow-opacity": shadowIntensity,
            "--sticker-lighting-constant": lightingIntensity,
            "--peel-direction": `${peelDirection}deg`,
        }),
        [
            rotate,
            peelBackHoverPct,
            peelBackActivePct,
            peelEasing,
            peelHoverEasing,
            width,
            shadowIntensity,
            lightingIntensity,
            peelDirection,
        ]
    );

    return (
        <div className={`sticker-draggable ${className}`} ref={dragTargetRef} style={cssVars}>
            {showDragHandle ? (
                <button
                    type="button"
                    className="sticker-drag-handle"
                    aria-label="Drag sticker"
                >
                    {dragHandleLabel}
                </button>
            ) : null}

            <svg width="0" height="0" aria-hidden="true">
                <defs>
                    <filter id={pointLightId}>
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feSpecularLighting
                            result="spec"
                            in="blur"
                            specularExponent="100"
                            specularConstant={lightingIntensity}
                            lightingColor="white"
                        >
                            <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceGraphic" result="lit" />
                        <feComposite in="lit" in2="SourceAlpha" operator="in" />
                    </filter>

                    <filter id={pointLightFlippedId}>
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feSpecularLighting
                            result="spec"
                            in="blur"
                            specularExponent="100"
                            specularConstant={lightingIntensity * 7}
                            lightingColor="white"
                        >
                            <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceGraphic" result="lit" />
                        <feComposite in="lit" in2="SourceAlpha" operator="in" />
                    </filter>

                    <filter id={dropShadowId}>
                        <feDropShadow
                            dx="2"
                            dy="4"
                            stdDeviation={3 * shadowIntensity}
                            floodColor="black"
                            floodOpacity={shadowIntensity}
                        />
                    </filter>

                    <filter id={expandAndFillId}>
                        <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
                        <feFlood floodColor="rgb(179,179,179)" result="flood" />
                        <feComposite operator="in" in="flood" in2="shape" />
                    </filter>
                </defs>
            </svg>

            <div className="sticker-container" ref={containerRef}>
                <div className="sticker-main" style={{ filter: `url(#${dropShadowId})` }}>
                    <div className="sticker-lighting" style={{ filter: `url(#${pointLightId})` }}>
                        <img
                            src={imageSrc}
                            alt="Sticker"
                            className="sticker-image"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>
                </div>

                <div className="sticker-flap">
                    <div className="sticker-flap-lighting" style={{ filter: `url(#${pointLightFlippedId})` }}>
                        <img
                            src={imageSrc}
                            alt="Sticker flap"
                            className="sticker-flap-image"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ filter: `url(#${expandAndFillId})` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
