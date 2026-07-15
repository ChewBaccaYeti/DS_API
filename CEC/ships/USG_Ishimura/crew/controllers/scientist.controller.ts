import { Request, Response, NextFunction } from 'express';
import Scientist from '../models/scientist.model';
import { paginate } from '../../bridge/utils/pagination';

export async function getScientists(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await paginate(Scientist, req);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
