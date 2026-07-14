import React, { useEffect, useState, type CSSProperties } from 'react';

interface CrosshairCursorProps {
    verticalColor?: string;
    verticalThickness?: number;
    horizontalColor?: string;
    horizontalThickness?: number;
    dotColor?: string;
    dotSize?: number;
    dotDisabled?: boolean;
    showPosition?: boolean;
    labelMode?: 'position' | 'custom';
    labelText?: string;
    labelFont?: CSSProperties;
    labelColor?: string;
    labelBg?: string;
    labelPaddingX?: number;
    labelPaddingY?: number;
    labelRadius?: number;
}

export default function CrosshairCursor({
    verticalColor = '#4dd0e1',
    verticalThickness = 1,
    horizontalColor = '#4dd0e1',
    horizontalThickness = 1,
    dotDisabled = false,
    dotColor = '#7fe9ff',
    dotSize = 10,
    showPosition = true,
    labelMode = 'position',
    labelText = 'AIM',
    labelFont = {
        fontFamily: "'Share Tech Mono', monospace",
        fontWeight: 400,
        fontSize: 11,
        lineHeight: '1.4em',
        letterSpacing: '0.15em',
        textAlign: 'left',
    },
    labelColor = '#7fe9ff',
    labelBg = 'rgba(13, 18, 24, 0.85)',
    labelPaddingX = 8,
    labelPaddingY = 4,
    labelRadius = 2,
}: CrosshairCursorProps) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };
        const onLeave = () => setIsVisible(false);
        const onEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);

        const prevHtml = document.documentElement.style.cursor;
        const prevBody = document.body.style.cursor;
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            document.documentElement.style.cursor = prevHtml;
            document.body.style.cursor = prevBody;
        };
    }, []);

    const x = pos?.x ?? 0;
    const y = pos?.y ?? 0;
    const show = isVisible && pos !== null;
    const linesOpacity = show ? 0.75 : 0;
    const dotOpacity = show ? 1 : 0;
    const transition = 'opacity 0.15s ease-out';

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 2147483647,
            }}>
            <div
                style={{
                    position: 'fixed',
                    left: x,
                    top: 0,
                    height: '100vh',
                    width: verticalThickness,
                    transform: 'translateX(-50%)',
                    backgroundColor: verticalColor,
                    boxShadow: `0 0 6px ${verticalColor}`,
                    opacity: linesOpacity,
                    transition,
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    top: y,
                    left: 0,
                    width: '100vw',
                    height: horizontalThickness,
                    transform: 'translateY(-50%)',
                    backgroundColor: horizontalColor,
                    boxShadow: `0 0 6px ${horizontalColor}`,
                    opacity: linesOpacity,
                    transition,
                    pointerEvents: 'none',
                }}
            />
            {!dotDisabled && (
                <div
                    style={{
                        position: 'fixed',
                        top: y,
                        left: x,
                        width: dotSize,
                        height: dotSize,
                        borderRadius: '50%',
                        border: `1px solid ${dotColor}`,
                        backgroundColor: 'transparent',
                        boxShadow: `0 0 10px ${dotColor}, inset 0 0 4px ${dotColor}`,
                        transform: 'translate(-50%, -50%)',
                        opacity: dotOpacity,
                        transition,
                        pointerEvents: 'none',
                    }}
                />
            )}
            {showPosition && (
                <div
                    style={{
                        position: 'fixed',
                        top: y,
                        left: x,
                        transform: 'translate(14px, 14px)',
                        pointerEvents: 'none',
                        ...labelFont,
                        color: labelColor,
                        background: labelBg,
                        padding: `${labelPaddingY}px ${labelPaddingX}px`,
                        borderRadius: labelRadius,
                        border: `1px solid ${verticalColor}`,
                        boxShadow: `0 0 8px ${verticalColor}`,
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        opacity: dotOpacity,
                        transition,
                    }}>
                    {labelMode === 'custom'
                        ? labelText
                        : `X:${Math.round(x)} Y:${Math.round(y)}`}
                </div>
            )}
        </div>
    );
}
