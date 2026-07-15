interface CrewSkeletonProps {
    count?: number;
    accentColor?: string;
}

export function CrewSkeleton({
    count = 6,
    accentColor = '#4dd0e1',
}: CrewSkeletonProps) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 18,
                marginTop: 16,
                width: '100%',
            }}
            aria-busy="true"
            aria-live="polite">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'relative',
                        padding: '18px 18px 18px 26px',
                        background:
                            'linear-gradient(135deg, #161c24 0%, #0d1218 100%)',
                        border: `1px solid ${accentColor}59`,
                        borderLeft: `4px solid ${accentColor}`,
                        clipPath:
                            'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
                        minHeight: 200,
                        opacity: 0.6,
                        animation: `crew-skeleton-pulse 1.4s ease-in-out ${i * 0.08}s infinite`,
                    }}>
                    <SkeletonBar w="60%" h={14} mb={12} color={accentColor} />
                    <SkeletonBar w="90%" h={10} />
                    <SkeletonBar w="80%" h={10} />
                    <SkeletonBar w="70%" h={10} />
                    <SkeletonBar w="85%" h={10} />
                    <SkeletonBar w="50%" h={10} />
                </div>
            ))}
            <style>{`
                @keyframes crew-skeleton-pulse {
                    0%, 100% { opacity: 0.5; }
                    50%      { opacity: 0.85; }
                }
            `}</style>
        </div>
    );
}

function SkeletonBar({
    w,
    h,
    mb = 8,
    color = '#8ea2b0',
}: {
    w: string;
    h: number;
    mb?: number;
    color?: string;
}) {
    return (
        <div
            style={{
                width: w,
                height: h,
                marginBottom: mb,
                background: `${color}33`,
                borderRadius: 2,
            }}
        />
    );
}
