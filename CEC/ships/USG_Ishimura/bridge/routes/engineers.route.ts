import { Router } from 'express';
import { getEngineers } from '../../crew/controllers/engineer.controller';

const router = Router();

router.get('/engineers', async (req, res) => {
    await getEngineers(req, res);
});

export default router;
