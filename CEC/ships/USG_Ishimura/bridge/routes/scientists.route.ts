import { Router } from 'express';
import { getScientists } from '../../crew/controllers/scientist.controller';
import { cacheMiddleware } from '../utils/cache';

const router = Router();

router.get('/scientists', cacheMiddleware({ ttlMs: 60_000 }), getScientists);

export default router;
