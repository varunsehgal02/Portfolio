'use client';
import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import StaggeredMenu from '@/components/StaggeredMenu';

const PillNav = ({
    items,
    className = '',
    ease = 'power3.easeOut',
    baseColor = '#0f1225',
    pillColor = '#161a35',
    hoveredPillTextColor = '#f1f5f9',
    pillTextColor = '#94a3b8',
    initialLoadAnimation = true,
}) => {
    const circleRefs = useRef([]);
    const tlRefs = useRef([]);
    const activeTweenRefs = useRef([]);
    const navItemsRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    const mobileMenuItems = useMemo(
        () =>
            items.map((item) => ({
                label: item.label,
                ariaLabel: item.ariaLabel || item.label,
                link: item.href,
            })),
        [items]
    );

    const mobileSocialItems = useMemo(
        () => [
            { label: 'Behance', link: 'https://www.behance.net/' },
            { label: 'LinkedIn', link: 'https://www.linkedin.com/' },
        ],
        []
    );

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach((circle, index) => {
                if (!circle?.parentElement) return;
                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

                const label = pill.querySelector('.pill-label');
                const white = pill.querySelector('.pill-label-hover');
                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });
                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
                if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }
                tlRefs.current[index] = tl;
            });
        };

        layout();
        const onResize = () => layout();
        window.addEventListener('resize', onResize);
        if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => { });

        if (initialLoadAnimation) {
            const navItems = navItemsRef.current;
            if (navItems) {
                gsap.set(navItems, { width: 0, overflow: 'hidden' });
                gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
            }
        }

        return () => window.removeEventListener('resize', onResize);
    }, [items, ease, initialLoadAnimation]);

    const handleEnter = (i) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
    };

    const handleLeave = (i) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
    };

    const cssVars = {
        '--base': baseColor,
        '--pill-bg': pillColor,
        '--hover-text': hoveredPillTextColor,
        '--pill-text': pillTextColor,
    };

    return (
        <div className="pill-nav-container">
            <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
                <div className="pill-nav-items desktop-only" ref={navItemsRef}>
                    <ul className="pill-list" role="menubar">
                        {items.map((item, i) => (
                            <li key={item.href || `item-${i}`} role="none">
                                <Link
                                    role="menuitem"
                                    href={item.href}
                                    className={`pill${pathname === item.href ? ' is-active' : ''}`}
                                    aria-label={item.ariaLabel || item.label}
                                    onMouseEnter={() => handleEnter(i)}
                                    onMouseLeave={() => handleLeave(i)}
                                >
                                    <span
                                        className="hover-circle"
                                        aria-hidden="true"
                                        ref={(el) => { circleRefs.current[i] = el; }}
                                    />
                                    <span className="label-stack">
                                        <span className="pill-label">{item.label}</span>
                                        <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </nav>

            <div className="mobile-only">
                <StaggeredMenu
                    position="right"
                    items={mobileMenuItems}
                    socialItems={mobileSocialItems}
                    displaySocials
                    displayItemNumbering={true}
                    menuButtonColor="#e6ff00"
                    openMenuButtonColor="#e6ff00"
                    changeMenuColorOnOpen={true}
                    colors={["#0a0a0a", "#151515"]}
                    accentColor="#E6FF00"
                    isFixed={true}
                    closeOnClickAway
                    onItemClick={(item) => router.push(item.link)}
                />
            </div>
        </div>
    );
};

export default PillNav;
