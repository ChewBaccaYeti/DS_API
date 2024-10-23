import { Request, Response } from 'express';
import Engineer from '../models/engineer.model';

export const getEngineers = async (req?: Request, res?: Response) => {
    try {
        const engineersData = await Engineer.find()
        if(res) {
            res.json(engineersData)
        }
        return engineersData
    } catch (error) {
        if(res) {
            res.status(500).send('Error occurred while fetching engineers.')
        }
        console.error(error)
        return []
    }
};
