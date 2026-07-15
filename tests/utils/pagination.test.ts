import { Request } from 'express';
import { parsePagination } from '../../CEC/ships/USG_Ishimura/bridge/utils/pagination';

function mockRequest(query: Record<string, string>): Request {
    return { query } as unknown as Request;
}

describe('parsePagination', () => {
    test('defaults to page=1 limit=50', () => {
        const { page, limit } = parsePagination(mockRequest({}));
        expect(page).toBe(1);
        expect(limit).toBe(50);
    });

    test('parses numeric query params', () => {
        const { page, limit } = parsePagination(
            mockRequest({ page: '3', limit: '25' }),
        );
        expect(page).toBe(3);
        expect(limit).toBe(25);
    });

    test('clamps page to >= 1', () => {
        expect(parsePagination(mockRequest({ page: '0' })).page).toBe(1);
        expect(parsePagination(mockRequest({ page: '-5' })).page).toBe(1);
    });

    test('clamps limit to [1, 200] with zero/negative → default 50', () => {
        // `parseInt('0') || 50` falls back to 50; still clamped at 200
        expect(parsePagination(mockRequest({ limit: '0' })).limit).toBe(50);
        expect(parsePagination(mockRequest({ limit: '9999' })).limit).toBe(200);
        expect(parsePagination(mockRequest({ limit: '1' })).limit).toBe(1);
    });

    test('non-numeric values fall back to defaults', () => {
        const { page, limit } = parsePagination(
            mockRequest({ page: 'abc', limit: 'xyz' }),
        );
        expect(page).toBe(1);
        expect(limit).toBe(50);
    });
});
