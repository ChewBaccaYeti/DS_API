import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import router from '../routes/index.routes';
import { errorHandler, notFoundHandler } from '../utils/errorEnvelope';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

export default function pipe() {
    const app = express();

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
        }),
    )
        .use(helmet.noSniff())
        .use(helmet.xssFilter())
        .use(helmet.frameguard({ action: 'deny' }))
        .use(helmet.ieNoOpen())
        .use(helmet.hidePoweredBy())
        .use(
            compression({
                threshold: 1024,
                filter: (req, res) => {
                    if (req.headers['x-no-compression']) return false;
                    return compression.filter(req, res);
                },
            }),
        )
        .use(limiter)
        .use(
            cors({
                origin: process.env.ALLOWED_ORIGINS?.split(',') || [
                    'http://localhost:3000',
                ],
                credentials: true,
                optionsSuccessStatus: 200,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'X-Requested-With',
                ],
            }),
        )
        .use(express.json({ limit: '10mb' }))
        .use(express.urlencoded({ extended: true, limit: '10mb' }))
        .use((req, _res, next) => {
            console.log(
                `📡 ${req.method} ${req.path} - ${req.ip} at ${new Date().toISOString()}`,
            );
            next();
        })
        .use('/api', router)
        .use(notFoundHandler)
        .use(errorHandler);

    return app;
}
