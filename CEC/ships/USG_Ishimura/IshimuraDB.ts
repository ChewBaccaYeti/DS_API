/*  
    MongoDB Atlas 
    MongoDBCompass / Studio 3T
    mongoose
    node.js
    Typescript
*/
require('dotenv').config({ path: '.env' });
export {};
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose, { Model } from 'mongoose';

import Miner from './crew/models/miner.model';
import Engineer from './crew/models/engineer.model';
import Scientist from './crew/models/scientist.model';

import { protoMiners } from './crew/models/miner.model';
import { protoEngineers } from './crew/models/engineer.model';
import { protoScientists } from './crew/models/scientist.model';

const app = express();
const username = process.env.MONGO_AEGIS_ADMIN;
const password = process.env.MONGO_AEGIS_PASS;
const database = process.env.MONGO_AEGIS_DB;

app.use(helmet());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(cors({ origin: '*' }));

app.get('/', (req: any, res: any) => {
    res.send(
        'Hello, World!' +
            'You must looking for Mining Deck. Go to the `/miners` endpoint.' +
            'If you are looking for Engineer Deck - go to the `/engineers` endpoint.' +
            'If you need Medical Bay - go to /scientists endpoint.',
    );
});

const createCrewRouteHandler = (model: Model<any>, crewName: string) => {
    return async (req: any, res: any) => {
        try {
            if (mongoose.connection.readyState !== 1) {
                return res.status(503).send('MongoDB not connected');
            }
            const data = await model.find();
            res.json(data);
        } catch (error) {
            res.status(500).send(
                `Error acquired during ${crewName} data fetching override.`,
            );
            console.error(error);
        }
    };
};

app.get('/miners', createCrewRouteHandler(Miner, 'miners'));
app.get('/engineers', createCrewRouteHandler(Engineer, 'engineers'));
app.get('/scientists', createCrewRouteHandler(Scientist, 'scientists'));

mongoose
    .connect(
        `mongodb+srv://${username}:${password}@${database}.fm1e1.mongodb.net/${database}?retryWrites=true&w=majority&appName=${database}`,
    )
    .then(() => {
        protoMiners();
        protoEngineers();
        protoScientists();
        console.log('Connection successful.');
        app.listen(3000, () => {
            console.log(`Server running at http://localhost:3000`);
        });
    })
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
