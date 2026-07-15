import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

const startedAt = Date.now();

const mongoStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
};

router.get('/health', (_req: Request, res: Response) => {
    const mongoState = mongoose.connection.readyState;
    const mongoStatus = mongoStateMap[mongoState] ?? 'unknown';
    const healthy = mongoStatus === 'connected';

    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        uptime: Math.floor((Date.now() - startedAt) / 1000),
        mongo: mongoStatus,
        timestamp: new Date().toISOString(),
    });
});

export default router;
