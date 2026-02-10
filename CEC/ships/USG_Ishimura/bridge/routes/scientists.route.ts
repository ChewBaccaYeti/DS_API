import { Router } from 'express';
import { getScientists } from '../../crew/controllers/scientist.controller';

const router = Router();

router.get('/scientists', async (req, res) => {
    await getScientists(req, res);
});

export default router;
