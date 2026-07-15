import { Request, Response, NextFunction } from 'express';
import Miner from '../models/miner.model';
import { paginate } from '../../bridge/utils/pagination';

export async function getMiners(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await paginate(Miner, req);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
