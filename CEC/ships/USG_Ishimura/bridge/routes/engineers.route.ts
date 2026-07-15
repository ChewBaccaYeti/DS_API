import { Router } from 'express';
import { getEngineers } from '../../crew/controllers/engineer.controller';
import { cacheMiddleware } from '../utils/cache';

const router = Router();

router.get('/engineers', cacheMiddleware({ ttlMs: 60_000 }), getEngineers);

export default router;
