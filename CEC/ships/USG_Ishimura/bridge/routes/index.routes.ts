import { Router } from 'express';
import minersRoutes from './miners.route';
import engineersRoutes from './engineers.route';
import scientistsRoutes from './scientists.route';

const router = Router();

// Main route
router.get('/', (req, res) => {
    res.send(
        'Hello, World! ' +
        'You must be looking for the Mining Deck. Go to the `/miners` endpoint. ' +
        'If you are looking for the Engineer Deck, go to the `/engineers` endpoint. ' +
        'If you need Medical Bay, go to `/scientists` endpoint.'
    );
});

router.use(minersRoutes);
router.use(engineersRoutes);
router.use(scientistsRoutes);

export default router;
