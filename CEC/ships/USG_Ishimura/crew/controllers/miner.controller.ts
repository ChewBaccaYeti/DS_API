import { Request, Response } from 'express';
import Miner from '../models/miner.model';

export const getMiners = async (req?: Request, res?: Response) => {
    try {
        const minersData = await Miner.find()
        if(res) {
            res.json(minersData)
        }
        return minersData
    } catch (error) {
        if(res) {
            res.status(500).send('Error occurred while fetching miners.')
        }
        console.error(error)
        return []
    }
};