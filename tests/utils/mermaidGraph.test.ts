import {
    buildRotationMermaid,
    currentSlot,
    type CrewLike,
    type RotationInput,
} from '../../CEC/ships/USG_Ishimura/bridge/utils/mermaidGraph';

function crew(
    id: string,
    rank: number,
    activeStatus = true,
    name = `Test ${id}`,
): CrewLike {
    return {
        id,
        name,
        rank,
        role: { name: 'Miner', symbol: 'M' },
        activeStatus,
        experience: { years: 5 },
    };
}

const fixedNow = new Date('2026-07-15T08:00:00.000Z').getTime();

const sample: RotationInput = {
    miners: [crew('MIN-1', 3), crew('MIN-2', 5), crew('MIN-3', 2, false)],
    engineers: [crew('ENG-1', 6), crew('ENG-2', 4)],
    scientists: [crew('SC-1', 9), crew('SC-2', 1)],
};

describe('currentSlot', () => {
    test('slot index increments every N hours', () => {
        const s1 = currentSlot(4, fixedNow);
        const s2 = currentSlot(4, fixedNow + 4 * 3600_000);
        expect(s2.slotIndex).toBe(s1.slotIndex + 1);
    });

    test('startsAt aligned to slot boundary', () => {
        const s = currentSlot(4, fixedNow + 100_000);
        expect(new Date(s.startsAt).getTime()).toBe(fixedNow);
    });

    test('reflects requested slotHours', () => {
        expect(currentSlot(2).slotHours).toBe(2);
        expect(currentSlot(8).slotHours).toBe(8);
    });
});

describe('buildRotationMermaid', () => {
    test('output is valid mermaid flowchart with header', () => {
        const { mermaid } = buildRotationMermaid(sample, {
            slotHours: 4,
            now: fixedNow,
        });
        expect(mermaid).toContain('flowchart LR');
        expect(mermaid).toContain('MINING[');
        expect(mermaid).toContain('ENG[');
        expect(mermaid).toContain('MED[');
    });

    test('returns one assignment per crew member', () => {
        const { assignments } = buildRotationMermaid(sample, {
            slotHours: 4,
            now: fixedNow,
        });
        const totalCrew =
            sample.miners.length +
            sample.engineers.length +
            sample.scientists.length;
        expect(assignments).toHaveLength(totalCrew);
    });

    test('inactive crew always land on off_duty', () => {
        const { assignments } = buildRotationMermaid(sample, {
            slotHours: 4,
            now: fixedNow,
        });
        const inactive = assignments.find(a => a.crewId === 'MIN-3');
        expect(inactive?.kind).toBe('off_duty');
    });

    test('officer flag matches rank >= 4', () => {
        const { assignments } = buildRotationMermaid(sample, {
            slotHours: 4,
            now: fixedNow,
        });
        for (const a of assignments) {
            expect(a.officer).toBe(a.rank >= 4);
        }
    });

    test('is deterministic for the same slot', () => {
        const a = buildRotationMermaid(sample, { slotHours: 4, now: fixedNow });
        const b = buildRotationMermaid(sample, { slotHours: 4, now: fixedNow });
        expect(a.mermaid).toBe(b.mermaid);
        expect(a.assignments).toEqual(b.assignments);
    });

    test('differs across slots', () => {
        const a = buildRotationMermaid(sample, { slotHours: 4, now: fixedNow });
        const b = buildRotationMermaid(sample, {
            slotHours: 4,
            now: fixedNow + 4 * 3600_000,
        });
        expect(a.assignments).not.toEqual(b.assignments);
    });

    test('officer tasks 60% biased over many slots', () => {
        const officer = crew('OFF-1', 6);
        const trials = 200;
        let nonRoutine = 0;
        for (let i = 0; i < trials; i++) {
            const { assignments } = buildRotationMermaid(
                { miners: [officer], engineers: [], scientists: [] },
                { slotHours: 4, now: fixedNow + i * 4 * 3600_000 },
            );
            const a = assignments[0];
            if (a.kind === 'officer_command') nonRoutine++;
        }
        // Expected ~ (1 - 0.2 off_duty) * 0.6 = 0.48. Allow generous margin.
        const ratio = nonRoutine / trials;
        expect(ratio).toBeGreaterThan(0.3);
        expect(ratio).toBeLessThan(0.65);
    });

    test('chief label shown for highest-rank active crew', () => {
        const { mermaid } = buildRotationMermaid(sample, {
            slotHours: 4,
            now: fixedNow,
        });
        // MIN-2 rank 5 is highest active among miners
        expect(mermaid).toMatch(/Chief: Test MIN-2/);
        expect(mermaid).toMatch(/Chief: Test ENG-1/);
        expect(mermaid).toMatch(/Chief: Test SC-1/);
    });
});
