import { Router } from 'express';
import { getScientists } from '../../crew/controllers/scientist.controller';

const router = Router();

router.get('/scientists', async (req, res) => {
    const scientistsData = await getScientists();
    res.json(scientistsData);
});

export default router;
