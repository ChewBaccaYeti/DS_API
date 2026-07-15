import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
    status: number;
    code: string;

    constructor(status: number, message: string, code = 'INTERNAL_ERROR') {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'ApiError';
    }
}

export interface ErrorEnvelope {
    error: {
        code: string;
        message: string;
    };
    endpoint: string;
    status: number;
    timestamp: string;
}

export function buildErrorEnvelope(
    err: Error & { status?: number; code?: string },
    req: Request,
): ErrorEnvelope {
    const status = err.status ?? 500;
    const isDev = process.env.NODE_ENV !== 'production';
    return {
        error: {
            code:
                err.code ?? (status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST'),
            message:
                isDev || status < 500
                    ? err.message
                    : 'An unexpected error occurred on USG Ishimura systems.',
        },
        endpoint: req.originalUrl,
        status,
        timestamp: new Date().toISOString(),
    };
}

export function errorHandler(
    err: Error & { status?: number; code?: string },
    req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const envelope = buildErrorEnvelope(err, req);
    if (envelope.status >= 500) {
        console.error('🚨 USG Ishimura Error:', err);
    }
    res.status(envelope.status).json(envelope);
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `The requested endpoint ${req.originalUrl} does not exist on USG Ishimura systems.`,
        },
        endpoint: req.originalUrl,
        status: 404,
        timestamp: new Date().toISOString(),
    });
}
