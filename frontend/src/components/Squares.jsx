"use client";

import { useRef, useEffect } from "react";

const Squares = ({
    direction = "right",
    speed = 1,
    borderColor = "#999",
    squareSize = 40,
    hoverFillColor = "#222",
    className = "",
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const numSquaresX = useRef();
    const numSquaresY = useRef();
    const gridOffset = useRef({ x: 0, y: 0 });
    const hoveredSquare = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startX =
                Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY =
                Math.floor(gridOffset.current.y / squareSize) * squareSize;

            for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
                for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    if (
                        hoveredSquare.current &&
                        Math.floor((x - startX) / squareSize) ===
                        hoveredSquare.current.x &&
                        Math.floor((y - startY) / squareSize) === hoveredSquare.current.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    ctx.strokeStyle = borderColor;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }

            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
            );
            gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const updateAnimation = () => {
            const effectiveSpeed = Math.max(speed, 0.1);
            switch (direction) {
                case "right":
                    gridOffset.current.x =
                        (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
                    break;
                case "left":
                    gridOffset.current.x =
                        (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
                    break;
                case "up":
                    gridOffset.current.y =
                        (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
                    break;
                case "down":
                    gridOffset.current.y =
                        (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
                    break;
                case "diagonal":
                    gridOffset.current.x =
                        (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
                    gridOffset.current.y =
                        (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
                    break;
                default:
                    break;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateAnimation);
        };

        // Listen on window so mouse interaction works even over content above the canvas
        const handleMouseMove = (event) => {
            const startX =
                Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY =
                Math.floor(gridOffset.current.y / squareSize) * squareSize;

            const hoveredSquareX = Math.floor(
                (event.clientX + gridOffset.current.x - startX) / squareSize
            );
            const hoveredSquareY = Math.floor(
                (event.clientY + gridOffset.current.y - startY) / squareSize
            );

            if (
                !hoveredSquare.current ||
                hoveredSquare.current.x !== hoveredSquareX ||
                hoveredSquare.current.y !== hoveredSquareY
            ) {
                hoveredSquare.current = { x: hoveredSquareX, y: hoveredSquareY };
            }
        };

        const handleMouseLeave = () => {
            hoveredSquare.current = null;
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        requestRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [direction, speed, borderColor, hoverFillColor, squareSize]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
                pointerEvents: "none",
            }}
        />
    );
};

export default Squares;
