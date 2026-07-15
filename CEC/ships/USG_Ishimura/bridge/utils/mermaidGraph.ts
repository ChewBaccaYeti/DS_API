import type { Types } from 'mongoose';

// ─── Types ──────────────────────────────────────────────────────────────
export interface CrewLike {
    _id?: unknown | Types.ObjectId;
    id: string;
    name: string;
    rank: number;
    role?: { name?: string; symbol?: string } | null;
    activeStatus: boolean;
    experience?: { years?: number } | null;
}

export interface RotationInput {
    miners: CrewLike[];
    engineers: CrewLike[];
    scientists: CrewLike[];
}

interface DeckSpec {
    key: DeckKey;
    label: string;
    accent: string;
    node: string;
    members: CrewLike[];
}

type DeckKey = 'MINING' | 'ENG' | 'MED';
type TaskKind =
    | 'mining'
    | 'engineering'
    | 'medical'
    | 'off_duty'
    | 'officer_command';

interface Assignment {
    task: string;
    kind: TaskKind;
}

// ─── Task pools (Dead Space canon) ─────────────────────────────────────
const ROUTINE_TASKS: Record<DeckKey, string[]> = {
    MINING: [
        'Ore Drilling',
        'Rock Sampling',
        'Debris Cleanup',
        'Cart Loading',
        'Tether Adjust',
        'Rig Inspect',
    ],
    ENG: [
        'Life Support Check',
        'Gravity Gen Tuning',
        'Coolant Flush',
        'Wiring Patch',
        'Filter Swap',
        'Airlock Cycle',
    ],
    MED: [
        'Vitals Round',
        'Med Inventory',
        'Sample Diagnostic',
        'Chart Review',
        'Stasis Charge',
        'Bio-Waste Purge',
    ],
};

const OFFICER_TASKS: Record<DeckKey, string[]> = {
    MINING: [
        'Blast Zone Command',
        'Aegis VII Extraction Ops',
        'Foreman Directive',
        'Marker Site Recon',
    ],
    ENG: [
        'Reactor Command',
        'ADS Cannon Ops',
        'Systems Audit',
        'RIG Diagnostic Sweep',
    ],
    MED: [
        'Necromorph Autopsy',
        'Outbreak Triage Command',
        'Marker Bio-Signature Study',
        'Chief Med Consult',
    ],
};

const OFF_DUTY = [
    'Off-duty (Sleep Bay)',
    'Off-duty (Mess Hall)',
    'Off-duty (Rec Room)',
    'Off-duty (Chapel)',
];

// ─── Deterministic pseudo-random ───────────────────────────────────────
function hash(input: string): number {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function pick<T>(pool: T[], seed: number): T {
    return pool[seed % pool.length];
}

// ─── Slot logic ────────────────────────────────────────────────────────
export interface RotationSlot {
    slotIndex: number;
    slotHours: number;
    startsAt: string;
    endsAt: string;
}

export function currentSlot(slotHours: number, now = Date.now()): RotationSlot {
    const ms = slotHours * 3600_000;
    const slotIndex = Math.floor(now / ms);
    const start = slotIndex * ms;
    return {
        slotIndex,
        slotHours,
        startsAt: new Date(start).toISOString(),
        endsAt: new Date(start + ms).toISOString(),
    };
}

const OFF_DUTY_CHANCE = 0.2;
const OFFICER_NON_ROUTINE_CHANCE = 0.6;

function assignFor(
    deckKey: DeckKey,
    crew: CrewLike,
    slotIndex: number,
): Assignment {
    if (!crew.activeStatus) {
        return { task: pick(OFF_DUTY, hash(crew.id)), kind: 'off_duty' };
    }

    const seed = hash(`${crew.id}::${slotIndex}`);
    const roll = (seed % 1000) / 1000;

    if (roll < OFF_DUTY_CHANCE) {
        return { task: pick(OFF_DUTY, seed), kind: 'off_duty' };
    }

    const isOfficer = crew.rank >= 4;
    if (isOfficer) {
        const nonRoutine =
            ((seed >> 8) % 1000) / 1000 < OFFICER_NON_ROUTINE_CHANCE;
        if (nonRoutine) {
            return {
                task: pick(OFFICER_TASKS[deckKey], seed),
                kind: 'officer_command',
            };
        }
    }

    const routineKind: TaskKind =
        deckKey === 'MINING'
            ? 'mining'
            : deckKey === 'ENG'
              ? 'engineering'
              : 'medical';
    return { task: pick(ROUTINE_TASKS[deckKey], seed), kind: routineKind };
}

// ─── Mermaid helpers ───────────────────────────────────────────────────
function sanitize(input: string): string {
    return input
        .replace(/["\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function nodeId(prefix: string, id: string): string {
    return `${prefix}_${id.replace(/[^A-Za-z0-9]/g, '_')}`;
}

function pickChief(members: CrewLike[]): CrewLike | undefined {
    if (!members.length) return undefined;
    const active = members.filter(m => m.activeStatus);
    const pool = active.length ? active : members;
    return [...pool].sort((a, b) => b.rank - a.rank)[0];
}

const EDGE_STYLE: Record<TaskKind, string> = {
    mining: 'stroke:#ffb03b,stroke-width:2px',
    engineering: 'stroke:#4dd0e1,stroke-width:2px',
    medical: 'stroke:#c8102e,stroke-width:2px',
    off_duty: 'stroke:#5a6b78,stroke-width:1.5px,stroke-dasharray:4 4',
    officer_command: 'stroke:#b47cff,stroke-width:2.5px,stroke-dasharray:6 3',
};

// ─── Public API ────────────────────────────────────────────────────────
export interface BuildOptions {
    slotHours?: number;
    now?: number;
}

export interface BuildResult {
    mermaid: string;
    slot: RotationSlot;
    assignments: Array<{
        crewId: string;
        name: string;
        deck: DeckKey;
        task: string;
        kind: TaskKind;
        rank: number;
        officer: boolean;
    }>;
}

export function buildRotationMermaid(
    input: RotationInput,
    options: BuildOptions = {},
): BuildResult {
    const slotHours = options.slotHours ?? 4;
    const slot = currentSlot(slotHours, options.now);

    const decks: DeckSpec[] = [
        {
            key: 'MINING',
            label: 'Mining Deck',
            accent: '#ffb03b',
            node: 'MINING',
            members: input.miners,
        },
        {
            key: 'ENG',
            label: 'Engineering',
            accent: '#4dd0e1',
            node: 'ENG',
            members: input.engineers,
        },
        {
            key: 'MED',
            label: 'Medical Bay',
            accent: '#c8102e',
            node: 'MED',
            members: input.scientists,
        },
    ];

    const assignments: BuildResult['assignments'] = [];
    const lines: string[] = [];

    lines.push('---');
    lines.push('config:');
    lines.push('  theme: dark');
    lines.push('  flowchart:');
    lines.push('    defaultRenderer: elk');
    lines.push('    curve: basis');
    lines.push('    nodeSpacing: 60');
    lines.push('    rankSpacing: 90');
    lines.push('    padding: 30');
    lines.push('    htmlLabels: true');
    lines.push('---');
    lines.push('flowchart LR');
    lines.push(
        `    %% Auto-generated slot ${slot.slotIndex} (${slotHours}h) — ${slot.startsAt}`,
    );

    for (const deck of decks) {
        const chief = pickChief(deck.members);
        const chiefLabel = chief
            ? `${sanitize(chief.name)}<br/>Rank ${chief.rank}`
            : 'Vacant';
        lines.push(
            `    ${deck.node}["${sanitize(deck.label)}<br/>Chief: ${chiefLabel}"]`,
        );
    }

    const edgeStyles: string[] = [];
    let edgeIndex = 0;

    for (const deck of decks) {
        for (const m of deck.members) {
            const nid = nodeId(deck.key, m.id);
            const inactive = !m.activeStatus ? ' ⚠' : '';
            const label = `${sanitize(m.name)}${inactive}<br/><i>${sanitize(m.role?.name ?? 'Unassigned')}</i><br/>R${m.rank}`;
            lines.push(`    ${nid}(["${label}"])`);

            const assignment = assignFor(deck.key, m, slot.slotIndex);
            assignments.push({
                crewId: m.id,
                name: m.name,
                deck: deck.key,
                task: assignment.task,
                kind: assignment.kind,
                rank: m.rank,
                officer: m.rank >= 4,
            });

            const isOfficer = m.rank >= 4;
            const edge = isOfficer
                ? `    ${deck.node} -->|"${sanitize(assignment.task)}"| ${nid}`
                : `    ${deck.node} --> ${nid}`;
            lines.push(edge);

            edgeStyles.push(
                `    linkStyle ${edgeIndex} ${EDGE_STYLE[assignment.kind]}`,
            );
            edgeIndex++;
        }
    }

    lines.push('');
    lines.push(
        '    %% Legend (junior crew colour coding; officers labelled inline)',
    );
    lines.push('    subgraph LEGEND["Task Legend"]');
    lines.push('        direction TB');
    lines.push('        L_MINE["◆ Mining task"]');
    lines.push('        L_ENG["◆ Engineering task"]');
    lines.push('        L_MED["◆ Medical task"]');
    lines.push('        L_OFF["◆ Off-duty"]');
    lines.push('        L_CMD["◆ Officer command (rank ≥ 4)"]');
    lines.push('    end');

    for (const deck of decks) {
        lines.push(`    class ${deck.node} deck_${deck.key.toLowerCase()}`);
    }

    lines.push('');
    lines.push(
        '    classDef deck_mining fill:#1a1408,stroke:#ffb03b,stroke-width:2px,color:#ffb03b',
    );
    lines.push(
        '    classDef deck_eng fill:#0a1a1e,stroke:#4dd0e1,stroke-width:2px,color:#4dd0e1',
    );
    lines.push(
        '    classDef deck_med fill:#1a0a0e,stroke:#c8102e,stroke-width:2px,color:#c8102e',
    );

    lines.push('');
    lines.push('    style LEGEND fill:#0d1218,stroke:#4dd0e1,color:#d7e6ef');
    lines.push('    style L_MINE fill:#1a1408,stroke:#ffb03b,color:#ffb03b');
    lines.push('    style L_ENG fill:#0a1a1e,stroke:#4dd0e1,color:#4dd0e1');
    lines.push('    style L_MED fill:#1a0a0e,stroke:#c8102e,color:#c8102e');
    lines.push('    style L_OFF fill:#141821,stroke:#5a6b78,color:#8ea2b0');
    lines.push('    style L_CMD fill:#1a1428,stroke:#b47cff,color:#b47cff');

    lines.push('');
    lines.push(...edgeStyles);

    return {
        mermaid: lines.join('\n'),
        slot,
        assignments,
    };
}
