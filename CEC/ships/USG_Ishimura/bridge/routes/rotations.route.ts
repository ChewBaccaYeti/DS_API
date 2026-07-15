import { Router, Request, Response, NextFunction } from 'express';
import Miner from '../../crew/models/miner.model';
import Engineer from '../../crew/models/engineer.model';
import Scientist from '../../crew/models/scientist.model';
import {
    buildRotationMermaid,
    currentSlot,
    type CrewLike,
} from '../utils/mermaidGraph';

const router = Router();

async function loadAll() {
    const [miners, engineers, scientists] = await Promise.all([
        Miner.find().lean<CrewLike[]>(),
        Engineer.find().lean<CrewLike[]>(),
        Scientist.find().lean<CrewLike[]>(),
    ]);
    return { miners, engineers, scientists };
}

function parseSlotHours(req: Request): number {
    const raw = parseInt(String(req.query.slotHours ?? '4'), 10);
    if (Number.isNaN(raw)) return 4;
    return Math.min(24, Math.max(1, raw));
}

router.get(
    '/rotations',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slotHours = parseSlotHours(req);
            const data = await loadAll();
            const { assignments, slot } = buildRotationMermaid(data, {
                slotHours,
            });
            res.setHeader(
                'Cache-Control',
                'public, max-age=30, stale-while-revalidate=15',
            );
            res.json({
                slot,
                decks: [
                    { key: 'miners', total: data.miners.length },
                    { key: 'engineers', total: data.engineers.length },
                    { key: 'scientists', total: data.scientists.length },
                ],
                assignments,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/rotations/mermaid',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slotHours = parseSlotHours(req);
            const data = await loadAll();
            const { mermaid } = buildRotationMermaid(data, { slotHours });
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader(
                'Cache-Control',
                'public, max-age=30, stale-while-revalidate=15',
            );
            res.send(mermaid);
        } catch (err) {
            next(err);
        }
    },
);

router.get('/rotations/slot', (req: Request, res: Response) => {
    const slotHours = parseSlotHours(req);
    res.json(currentSlot(slotHours));
});

export default router;
