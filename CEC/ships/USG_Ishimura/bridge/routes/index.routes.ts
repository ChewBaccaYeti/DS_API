import { Router } from 'express';
import minersRoutes from './miners.route';
import engineersRoutes from './engineers.route';
import scientistsRoutes from './scientists.route';
import healthRoutes from './health.route';
import docsRoutes from './docs.route';
import rotationsRoutes from './rotations.route';

const router = Router();

router.get('/', (_req, res) => {
    res.json({
        service: 'USG Ishimura Bridge API',
        endpoints: [
            '/api/health',
            '/api/docs',
            '/api/openapi.json',
            '/api/miners',
            '/api/engineers',
            '/api/scientists',
            '/api/rotations',
            '/api/rotations/mermaid',
        ],
    });
});

router.use(healthRoutes);
router.use(docsRoutes);
router.use(minersRoutes);
router.use(engineersRoutes);
router.use(scientistsRoutes);
router.use(rotationsRoutes);

export default router;
