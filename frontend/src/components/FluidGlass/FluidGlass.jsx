/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useRef } from 'react';
import './FluidGlass.css';

export default function FluidGlass({ className = '', style = {}, children }) {
    const rootRef = useRef(null);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--fx', `${x}px`);
            el.style.setProperty('--fy', `${y}px`);
        };

        const onLeave = () => {
            el.style.setProperty('--fx', '-9999px');
            el.style.setProperty('--fy', '-9999px');
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);

        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div ref={rootRef} className={`fluid-glass ${className}`} style={style}>
            <div className="fluid-glass-beams" aria-hidden="true" />
            <div className="fluid-glass-lens" aria-hidden="true" />
            <div className="fluid-glass-content">{children}</div>
        </div>
    );
}
