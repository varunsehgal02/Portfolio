'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedCard({
    imageSrc,
    altText = 'Tilted card image',
    captionText = '',
    containerHeight = '100%',
    containerWidth = '100%',
    imageHeight = '100%',
    imageWidth = '100%',
    scaleOnHover = 1.03,
    rotateAmplitude = 10,
    showTooltip = false,
    overlayContent = null,
    displayOverlayContent = false,
    className = ''
}) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);

    function handleMouse(e) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <figure
            ref={ref}
            className={`tilted-card-figure ${className}`}
            style={{ height: containerHeight, width: containerWidth }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="tilted-card-inner"
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX,
                    rotateY,
                    scale
                }}
            >
                {imageSrc ? (
                    <motion.img
                        src={imageSrc}
                        alt={altText}
                        className="tilted-card-img"
                        style={{ width: imageWidth, height: imageHeight }}
                    />
                ) : (
                    <div className="tilted-card-fallback" aria-label={altText} />
                )}

                {displayOverlayContent && overlayContent && (
                    <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
                )}
            </motion.div>

            {showTooltip && captionText && (
                <motion.figcaption
                    className="tilted-card-caption"
                    style={{ x, y, opacity }}
                >
                    {captionText}
                </motion.figcaption>
            )}
        </figure>
    );
}
