export interface Paginated<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
}

export interface ApiErrorEnvelope {
    error: { code: string; message: string };
    endpoint: string;
    status: number;
    timestamp: string;
}

export class ApiClientError extends Error {
    status: number;
    code: string;
    endpoint: string;

    constructor(envelope: ApiErrorEnvelope) {
        super(envelope.error.message);
        this.status = envelope.status;
        this.code = envelope.error.code;
        this.endpoint = envelope.endpoint;
        this.name = 'ApiClientError';
    }
}

export async function apiGet<T>(
    path: string,
    params?: Record<string, string | number>,
): Promise<T> {
    const url = new URL(path, window.location.origin);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            url.searchParams.set(k, String(v));
        }
    }
    const res = await fetch(url.pathname + url.search);
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
        throw new Error(
            `Non-JSON response from ${url.pathname}: ${res.status} ${res.statusText}`,
        );
    }
    const body = await res.json();
    if (!res.ok) {
        throw new ApiClientError(body as ApiErrorEnvelope);
    }
    return body as T;
}
