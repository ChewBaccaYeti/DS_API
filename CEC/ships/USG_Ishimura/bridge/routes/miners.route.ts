import { Router } from 'express';
import { getMiners } from '../../crew/controllers/miner.controller';

const router = Router();

router.get('/miners', async (req, res) => {
    const minersData = await getMiners();
    res.json(minersData);
});

export default router;
