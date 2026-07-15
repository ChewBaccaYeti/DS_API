import { Request } from 'express';
import {
    ApiError,
    buildErrorEnvelope,
} from '../../CEC/ships/USG_Ishimura/bridge/utils/errorEnvelope';

function mockRequest(url = '/api/test'): Request {
    return { originalUrl: url } as Request;
}

describe('errorEnvelope', () => {
    afterEach(() => {
        delete process.env.NODE_ENV;
    });

    test('ApiError carries status + code + message', () => {
        const err = new ApiError(400, 'Bad input', 'VALIDATION_FAILED');
        expect(err.status).toBe(400);
        expect(err.code).toBe('VALIDATION_FAILED');
        expect(err.message).toBe('Bad input');
        expect(err.name).toBe('ApiError');
    });

    test('buildErrorEnvelope wraps ApiError with matching fields', () => {
        const err = new ApiError(404, 'Missing crew', 'NOT_FOUND');
        const envelope = buildErrorEnvelope(err, mockRequest('/api/miners/1'));

        expect(envelope.status).toBe(404);
        expect(envelope.error.code).toBe('NOT_FOUND');
        expect(envelope.error.message).toBe('Missing crew');
        expect(envelope.endpoint).toBe('/api/miners/1');
        expect(new Date(envelope.timestamp).toString()).not.toBe(
            'Invalid Date',
        );
    });

    test('defaults status to 500 and code to INTERNAL_ERROR', () => {
        const envelope = buildErrorEnvelope(new Error('boom'), mockRequest());
        expect(envelope.status).toBe(500);
        expect(envelope.error.code).toBe('INTERNAL_ERROR');
    });

    test('masks 500 messages in production', () => {
        process.env.NODE_ENV = 'production';
        const envelope = buildErrorEnvelope(
            new Error('leak me'),
            mockRequest(),
        );
        expect(envelope.error.message).not.toContain('leak me');
        expect(envelope.error.message).toMatch(/unexpected/i);
    });

    test('4xx messages passed through even in production', () => {
        process.env.NODE_ENV = 'production';
        const err = new ApiError(400, 'Validation failed', 'VALIDATION_FAILED');
        const envelope = buildErrorEnvelope(err, mockRequest());
        expect(envelope.error.message).toBe('Validation failed');
    });
});
