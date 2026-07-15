import { LRUCache } from 'lru-cache';
import { Request, Response, NextFunction } from 'express';

const DEFAULT_TTL_MS = 60_000;

const store = new LRUCache<string, string>({
    max: 500,
    ttl: DEFAULT_TTL_MS,
});

interface CacheOptions {
    ttlMs?: number;
    keyBuilder?: (req: Request) => string;
}

export function cacheMiddleware(options: CacheOptions = {}) {
    const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    const buildKey = options.keyBuilder ?? ((req: Request) => req.originalUrl);
    const maxAgeSec = Math.floor(ttlMs / 1000);

    return function cache(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (req.method !== 'GET') {
            next();
            return;
        }

        const key = buildKey(req);
        const hit = store.get(key);

        if (hit) {
            res.setHeader('X-Cache', 'HIT');
            res.setHeader(
                'Cache-Control',
                `public, max-age=${maxAgeSec}, stale-while-revalidate=30`,
            );
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.status(200).send(hit);
            return;
        }

        const originalJson = res.json.bind(res);
        res.json = ((body: unknown) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                store.set(key, JSON.stringify(body), { ttl: ttlMs });
            }
            res.setHeader('X-Cache', 'MISS');
            res.setHeader(
                'Cache-Control',
                `public, max-age=${maxAgeSec}, stale-while-revalidate=30`,
            );
            return originalJson(body);
        }) as Response['json'];

        next();
    };
}

export function invalidateCache(prefix?: string): number {
    if (!prefix) {
        const size = store.size;
        store.clear();
        return size;
    }
    let n = 0;
    for (const key of store.keys()) {
        if (key.startsWith(prefix)) {
            store.delete(key);
            n++;
        }
    }
    return n;
}

export function cacheStats() {
    return { size: store.size, max: store.max, ttl: DEFAULT_TTL_MS };
}
