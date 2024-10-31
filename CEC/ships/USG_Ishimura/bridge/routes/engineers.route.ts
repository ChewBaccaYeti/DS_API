import { Router } from 'express';
import { getEngineers } from '../../crew/controllers/engineer.controller';

const router = Router();

router.get('/engineers', async (req, res) => {
    const engineersData = await getEngineers();
    res.json(engineersData);
});

export default router;
