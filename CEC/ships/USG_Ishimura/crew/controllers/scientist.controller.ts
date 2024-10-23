import { Request, Response } from 'express';
import Scientist from '../models/scientist.model';

export const getScientists = async (req?: Request, res?: Response) => {
    try {
        const scientistsData = await Scientist.find()
        if(res) {
            res.json(scientistsData)
        }
        return scientistsData
    } catch (error) {
        if(res) {
            res.status(500).send('Error occurred while fetching scientists.')
        }
        console.error(error)
        return []
    }
};
