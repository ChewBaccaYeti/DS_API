import { Request, Response, NextFunction } from 'express';
import Engineer from '../models/engineer.model';
import { paginate } from '../../bridge/utils/pagination';

export async function getEngineers(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await paginate(Engineer, req);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
