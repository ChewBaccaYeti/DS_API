import { Router } from 'express';
import { getMiners } from '../../crew/controllers/miner.controller';

const router = Router();

router.get('/miners', async (req, res) => {
    await getMiners(req, res);
});

export default router;
