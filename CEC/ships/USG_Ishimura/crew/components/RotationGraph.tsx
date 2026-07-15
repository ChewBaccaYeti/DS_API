import { useEffect, useMemo, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from './ui/ErrorState';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        background: '#05070a',
        primaryColor: '#161c24',
        primaryTextColor: '#d7e6ef',
        primaryBorderColor: '#4dd0e1',
        lineColor: '#4dd0e1',
        secondaryColor: '#0d1218',
        tertiaryColor: '#1e2632',
        fontFamily: "'Chakra Petch', 'Share Tech Mono', sans-serif",
    },
    flowchart: { htmlLabels: true, curve: 'basis' },
    securityLevel: 'loose',
});

const SLOT_OPTIONS = [1, 2, 4, 6, 8, 12];

interface RotationSlot {
    slotIndex: number;
    slotHours: number;
    startsAt: string;
    endsAt: string;
}

async function fetchMermaid(slotHours: number): Promise<string> {
    const res = await fetch(`/api/rotations/mermaid?slotHours=${slotHours}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
}

async function fetchSlot(slotHours: number): Promise<RotationSlot> {
    const res = await fetch(`/api/rotations/slot?slotHours=${slotHours}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function useCountdown(target: string | undefined): string {
    const [remain, setRemain] = useState('—');
    useEffect(() => {
        if (!target) return undefined;
        const tick = () => {
            const ms = new Date(target).getTime() - Date.now();
            if (ms <= 0) {
                setRemain('rotating…');
                return;
            }
            const h = Math.floor(ms / 3_600_000);
            const m = Math.floor((ms % 3_600_000) / 60_000);
            const s = Math.floor((ms % 60_000) / 1000);
            setRemain(
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
            );
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, [target]);
    return remain;
}

function RotationGraph() {
    const [slotHours, setSlotHours] = useState(4);

    const slotQuery = useQuery({
        queryKey: ['rotations', 'slot', slotHours],
        queryFn: () => fetchSlot(slotHours),
        refetchInterval: 15_000,
    });

    const graphQuery = useQuery({
        queryKey: [
            'rotations',
            'mermaid',
            slotHours,
            slotQuery.data?.slotIndex,
        ],
        queryFn: () => fetchMermaid(slotHours),
        enabled: Boolean(slotQuery.data),
        staleTime: 60_000,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const [renderError, setRenderError] = useState<Error | null>(null);
    const countdown = useCountdown(slotQuery.data?.endsAt);

    const renderKey = useMemo(
        () => `rotation-graph-${Date.now()}`,
        [graphQuery.data],
    );

    useEffect(() => {
        if (!graphQuery.data || !containerRef.current) return undefined;
        let cancelled = false;
        mermaid
            .render(renderKey, graphQuery.data)
            .then(({ svg }) => {
                if (cancelled || !containerRef.current) return;
                containerRef.current.innerHTML = svg;
                const svgEl = containerRef.current.querySelector('svg');
                if (svgEl) {
                    svgEl.style.width = '100%';
                    svgEl.style.height = 'auto';
                    svgEl.style.maxWidth = '100%';
                }
                setRenderError(null);
            })
            .catch((e: Error) => {
                if (!cancelled) setRenderError(e);
            });
        return () => {
            cancelled = true;
        };
    }, [graphQuery.data, renderKey]);

    if (graphQuery.isError) {
        return (
            <div id="rotations">
                <h2>Crew Rotation ⇄</h2>
                <ErrorState
                    error={graphQuery.error}
                    onRetry={graphQuery.refetch}
                />
            </div>
        );
    }

    if (renderError) {
        return (
            <div id="rotations">
                <h2>Crew Rotation ⇄</h2>
                <ErrorState error={renderError} onRetry={graphQuery.refetch} />
            </div>
        );
    }

    return (
        <div
            id="rotations"
            style={{
                padding: '20px 16px',
                width: '100%',
                maxWidth: '100vw',
                boxSizing: 'border-box',
            }}>
            <h2
                style={{
                    textAlign: 'center',
                    marginBottom: 8,
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: '#d7e6ef',
                    textShadow:
                        '0 0 10px rgba(77,208,225,0.7), 0 0 20px rgba(77,208,225,0.35)',
                }}>
                Crew Rotation ⇄
            </h2>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 24,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 12,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#8ea2b0',
                }}>
                <span>Slot #{slotQuery.data?.slotIndex ?? '—'}</span>
                <span>Duration: {slotHours}h</span>
                <span>
                    Next rotation in{' '}
                    <span style={{ color: '#7fe9ff' }}>{countdown}</span>
                </span>
                <label style={{ display: 'inline-flex', gap: 8 }}>
                    Slot length:
                    <select
                        value={slotHours}
                        onChange={e => setSlotHours(Number(e.target.value))}
                        style={{
                            background: '#0d1218',
                            color: '#4dd0e1',
                            border: '1px solid #4dd0e1',
                            padding: '2px 6px',
                            fontFamily: 'inherit',
                            letterSpacing: 'inherit',
                        }}>
                        {SLOT_OPTIONS.map(h => (
                            <option key={h} value={h}>
                                {h}h
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    minHeight: 480,
                    overflow: 'auto',
                    padding: 16,
                    background: 'rgba(13, 18, 24, 0.7)',
                    border: '1px solid rgba(77, 208, 225, 0.35)',
                    borderRadius: 4,
                }}
                aria-label="Live crew rotation graph"
            />

            {graphQuery.isFetching && (
                <p
                    className="loading"
                    style={{
                        marginTop: 12,
                        textAlign: 'center',
                        fontSize: 12,
                    }}>
                    Refreshing rotation telemetry…
                </p>
            )}
        </div>
    );
}

export default RotationGraph;
