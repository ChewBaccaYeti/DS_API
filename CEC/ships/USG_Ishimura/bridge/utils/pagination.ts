import { Request } from 'express';
import { Model } from 'mongoose';

export interface Paginated<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
}

export function parsePagination(req: Request): { page: number; limit: number } {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
    const rawLimit = parseInt(String(req.query.limit ?? '50'), 10) || 50;
    const limit = Math.min(200, Math.max(1, rawLimit));
    return { page, limit };
}

export async function paginate<T>(
    model: Model<T>,
    req: Request,
): Promise<Paginated<T>> {
    const { page, limit } = parsePagination(req);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        model.find().skip(skip).limit(limit).lean<T[]>(),
        model.estimatedDocumentCount(),
    ]);
    return { items, page, limit, total };
}
