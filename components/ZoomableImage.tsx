import React, { useState, useRef, MouseEvent, WheelEvent } from 'react';

interface ZoomableImageProps {
    children: React.ReactNode;
    className?: string;
    maxZoom?: number;
    minZoom?: number;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
    children,
    className = "",
    maxZoom = 3,
    minZoom = 1.5,
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(2); // Default zoom level
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => setIsHovering(true);

    const handleMouseLeave = () => {
        setIsHovering(false);
        setZoomLevel(2); // Reset zoom on leave
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setCursorPos({ x, y });
    };

    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        if (!isHovering) return;
        // Prevent default scroll behavior if we are handling zoom? 
        // Usually only if we stop propagation, but for a component inside a page, 
        // maybe we shouldn't block page scroll unless intended. 
        // Amazon zooms nicely but doesn't block page scroll usually unless sticky.
        // Let's adjust zoom level.
        e.stopPropagation();

        setZoomLevel(prev => {
            const delta = -e.deltaY * 0.005;
            const newZoom = Math.min(Math.max(prev + delta, minZoom), maxZoom);
            return newZoom;
        });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-crosshair ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
        >
            <div
                className="w-full h-full transition-transform duration-75 ease-out will-change-transform"
                style={{
                    transformOrigin: `${cursorPos.x * 100}% ${cursorPos.y * 100}%`,
                    transform: isHovering
                        ? `scale(${zoomLevel})`
                        : 'scale(1)',
                }}
            >
                {children}
            </div>
        </div>
    );
};
