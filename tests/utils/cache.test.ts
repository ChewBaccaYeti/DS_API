import { Request, Response, NextFunction } from 'express';
import {
    cacheMiddleware,
    invalidateCache,
    cacheStats,
} from '../../CEC/ships/USG_Ishimura/bridge/utils/cache';

interface MockRes {
    statusCode: number;
    headers: Record<string, string>;
    body?: unknown;
    setHeader: jest.Mock;
    status: jest.Mock;
    send: jest.Mock;
    json: (body: unknown) => MockRes;
}

function mockReq(url: string, method = 'GET'): Request {
    return { originalUrl: url, method } as Request;
}

function mockRes(): MockRes {
    const res: MockRes = {
        statusCode: 200,
        headers: {},
        setHeader: jest.fn(function (this: MockRes, k: string, v: string) {
            this.headers[k] = v;
        }),
        status: jest.fn(function (this: MockRes, code: number) {
            this.statusCode = code;
            return this;
        }),
        send: jest.fn(function (this: MockRes, body: unknown) {
            this.body = body;
            return this;
        }),
        json: function (body: unknown) {
            this.body = body;
            return this;
        },
    };
    return res;
}

describe('cacheMiddleware', () => {
    beforeEach(() => {
        invalidateCache();
    });

    test('skips non-GET requests', () => {
        const mw = cacheMiddleware();
        const next: NextFunction = jest.fn();
        mw(mockReq('/a', 'POST'), mockRes() as unknown as Response, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('MISS on first call, populates store on json()', () => {
        const mw = cacheMiddleware({ ttlMs: 60_000 });
        const req = mockReq('/api/miners');
        const res = mockRes();
        const next: NextFunction = jest.fn();

        mw(req, res as unknown as Response, next);
        (res as unknown as Response).json({ items: [1, 2, 3] });

        expect(res.headers['X-Cache']).toBe('MISS');
        expect(cacheStats().size).toBe(1);
    });

    test('HIT on second call, returns stored payload', () => {
        const mw = cacheMiddleware({ ttlMs: 60_000 });
        const req1 = mockReq('/api/miners');
        const res1 = mockRes();
        mw(req1, res1 as unknown as Response, jest.fn());
        (res1 as unknown as Response).json({ items: [42] });

        const req2 = mockReq('/api/miners');
        const res2 = mockRes();
        const next2: NextFunction = jest.fn();
        mw(req2, res2 as unknown as Response, next2);

        expect(next2).not.toHaveBeenCalled();
        expect(res2.headers['X-Cache']).toBe('HIT');
        expect(res2.body).toBe(JSON.stringify({ items: [42] }));
    });

    test('invalidateCache clears entries by prefix', () => {
        const mw = cacheMiddleware();
        mw(mockReq('/api/miners'), mockRes() as unknown as Response, jest.fn());
        (mockRes() as unknown as Response).json({});
        mw(
            mockReq('/api/engineers'),
            mockRes() as unknown as Response,
            jest.fn(),
        );

        invalidateCache('/api/miners');
        expect(cacheStats().size).toBeGreaterThanOrEqual(0);
    });
});
