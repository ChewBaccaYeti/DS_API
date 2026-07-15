/**
 * Legacy standalone entry point.
 *
 * Runs a minimal Express server on port 3000 backed by a separate Mongo
 * cluster (`MONGO_AEGIS_*`). Kept for the `npm run RIG` script and RIG
 * diagnostics printouts; the main production flow uses
 * `bridge/server/server.ts` on `APP_PORT`.
 */

require('dotenv').config({ path: '.env' });
export {};

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose, { Model } from 'mongoose';

import Miner from './crew/models/miner.model';
import Engineer from './crew/models/engineer.model';
import Scientist from './crew/models/scientist.model';

import { protoMiners } from './crew/models/miner.model';
import { protoEngineers } from './crew/models/engineer.model';
import { protoScientists } from './crew/models/scientist.model';

import { CrewMember } from './crew/CEC.interface';

const LEGACY_PORT = 3000;

const app = express();
const username = process.env.MONGO_AEGIS_ADMIN;
const password = process.env.MONGO_AEGIS_PASS;
const database = process.env.MONGO_AEGIS_DB;

if (!username || !password || !database) {
    throw new Error(
        'Legacy Aegis env vars missing (MONGO_AEGIS_ADMIN/PASS/DB).',
    );
}

app.use(helmet());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(cors({ origin: '*' }));

app.get('/', (_req: Request, res: Response) => {
    res.json({
        service: 'USG Ishimura Legacy RIG endpoint',
        endpoints: ['/miners', '/engineers', '/scientists'],
    });
});

function crewHandler(model: Model<CrewMember>, crewName: string) {
    return async (_req: Request, res: Response): Promise<void> => {
        if (mongoose.connection.readyState !== 1) {
            res.status(503).json({
                error: {
                    code: 'DB_UNAVAILABLE',
                    message: 'MongoDB not connected',
                },
                endpoint: `/${crewName}`,
                status: 503,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        try {
            const data = await model.find().lean<CrewMember[]>();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                error: {
                    code: 'FETCH_FAILED',
                    message: `Error fetching ${crewName}.`,
                },
                endpoint: `/${crewName}`,
                status: 500,
                timestamp: new Date().toISOString(),
            });
            console.error(error);
        }
    };
}

app.get('/miners', crewHandler(Miner, 'miners'));
app.get('/engineers', crewHandler(Engineer, 'engineers'));
app.get('/scientists', crewHandler(Scientist, 'scientists'));

mongoose
    .connect(
        `mongodb+srv://${username}:${password}@${database}.fm1e1.mongodb.net/${database}?retryWrites=true&w=majority&appName=${database}`,
    )
    .then(() => {
        protoMiners();
        protoEngineers();
        protoScientists();
        console.log('[RIG] Legacy Aegis connection successful.');
        app.listen(LEGACY_PORT, () => {
            console.log(
                `[RIG] Legacy server at http://localhost:${LEGACY_PORT}`,
            );
        });
    })
    .catch((error: Error) => {
        console.error('[RIG] Legacy connection error:', error);
        process.exit(1);
    });
