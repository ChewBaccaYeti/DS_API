interface ErrorStateProps {
    error: unknown;
    onRetry?: () => void;
    accentColor?: string;
}

function readMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Unknown telemetry failure.';
}

export function ErrorState({
    error,
    onRetry,
    accentColor = '#c8102e',
}: ErrorStateProps) {
    const message = readMessage(error);
    return (
        <div
            role="alert"
            style={{
                margin: '24px auto',
                padding: '20px 26px',
                maxWidth: 640,
                background: 'rgba(13, 18, 24, 0.85)',
                border: `1px solid ${accentColor}`,
                borderLeft: `4px solid ${accentColor}`,
                boxShadow: `0 0 12px ${accentColor}66`,
                clipPath:
                    'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
                fontFamily: "'Chakra Petch', sans-serif",
                color: '#d7e6ef',
            }}>
            <div
                style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 12,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: accentColor,
                    marginBottom: 8,
                }}>
                ⚠ RIG Telemetry Fault
            </div>
            <div style={{ fontSize: 14, marginBottom: 14 }}>{message}</div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 18px',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 12,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: '#7fe9ff',
                        background: 'rgba(77, 208, 225, 0.1)',
                        border: '1px solid #4dd0e1',
                        boxShadow: '0 0 8px rgba(77, 208, 225, 0.5)',
                        clipPath:
                            'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}>
                    Retry Signal
                </button>
            )}
        </div>
    );
}
