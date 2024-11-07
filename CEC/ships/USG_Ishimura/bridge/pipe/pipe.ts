import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import router from '../routes/index.routes';

export default function pipe() {
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(helmet.hsts());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(cors({ origin: '*' }));

    app.use(router);

    return app;
}
