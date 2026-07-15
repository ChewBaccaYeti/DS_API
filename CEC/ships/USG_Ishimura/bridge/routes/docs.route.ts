import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const router = Router();

const specPath = path.resolve(process.cwd(), 'CEC.swagger.yaml');
const swaggerSpec = YAML.load(specPath);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.get('/openapi.json', (_req, res) => {
    res.json(swaggerSpec);
});

export default router;
