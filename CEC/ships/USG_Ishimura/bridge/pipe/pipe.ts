import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import router from '../routes/index.routes';

import { createLogger, format, transports } from "winston";
import winstonDevConsole from "@epegzz/winston-dev-console";

let log = createLogger({
    level: "silly", // or use process.env.LOG_LEVEL
});

// Note: You probably only want to use winstonDevConsole during development
log = winstonDevConsole.init(log);
log.add(
    winstonDevConsole.transport({
        showTimestamps: false,
        addLineSeparation: true,
    })
);

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

export default function pipe() {
    const app = express();
    console.log(log.info('🚀 Configuring USG Ishimura bridge pipeline...'));
    // Middleware security
    app
        .use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            }
        }))
        .use(helmet.noSniff())
        .use(helmet.xssFilter())
        .use(helmet.frameguard({ action: 'deny' }))
        .use(helmet.ieNoOpen())
        .use(helmet.hidePoweredBy())
        .use(compression({
            threshold: 1024,
            filter: (req, res) => {
                if (req.headers['x-no-compression']) return false;
                return compression.filter(req, res);
            }
        }))
        .use(limiter)
        .use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }))
        .use(express.json({ limit: '10mb' }))
        .use(express.urlencoded({ extended: true, limit: '10mb' }))
        .use((req, res, next) => {
            // Request logging middleware
            console.log(`📡 ${req.method} ${req.path} - ${req.ip} at ${new Date().toISOString()}`);
            next();
        })
        .use('/api', router)
        .use('*', (req, res) => {
            res.status(404).json({
                error: 'Route not found',
                message: `The requested endpoint ${req.originalUrl} does not exist on USG Ishimura systems.`,
                timestamp: new Date().toISOString()
            });
        })
        .use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            // Global error handler
            console.error(log.error('🚨 USG Ishimura Error:', { error }));
            res.status(error.status || 500).json({
                error: 'Internal Server Error',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!',
                timestamp: new Date().toISOString()
            });
        });
    const routeCount = app._router?.stack?.length || 0;
    console.log(log.silly(`✅ USG Ishimura bridge pipeline configured successfully!`));
    console.log(log.info("🛡️ Security:",
        { Options: [ "Helmet, CORS , Rate Limiting, Compression" ] }, 
        { Values: [ "Wore, Enabled, Counting, Optimized"] }
    ));
    console.log(log.info(`🔗 Routes: ${routeCount} middleware/routes loaded`));
    console.log(`🚀 Ready for deep space operations`);

    return app;
};
