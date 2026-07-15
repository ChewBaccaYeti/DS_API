import { Router } from 'express';
import { getMiners } from '../../crew/controllers/miner.controller';
import { cacheMiddleware } from '../utils/cache';

const router = Router();

router.get('/miners', cacheMiddleware({ ttlMs: 60_000 }), getMiners);

export default router;
