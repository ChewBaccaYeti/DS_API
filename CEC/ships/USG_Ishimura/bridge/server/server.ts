require('dotenv').config({ path: '.env' });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { getMiners } from '../../crew/controllers/miner.controller';
import { getEngineers } from '../../crew/controllers/engineer.controller';
import { getScientists } from '../../crew/controllers/scientist.controller';

const app = express();
const username = process.env.MONGO_AEGIS_ADMIN;
const password = process.env.MONGO_AEGIS_PASS;
const database = process.env.MONGO_AEGIS_DB;
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send(
        'Hello, World!' +
        'You must be looking for the Mining Deck. Go to the `/miners` endpoint. ' +
        'If you are looking for the Engineer Deck, go to the `/engineers` endpoint. ' +
        'If you need Medical Bay, go to `/scientists` endpoint. '
    )
});

app.get('/miners', async (req, res) => {
    const minersData = await getMiners()
    res.json(minersData)
});

app.get('/engineers', async (req, res) => {
    const engineersData = await getEngineers()
    res.json(engineersData)
});

app.get('/scientists', async (req, res) => {
    const scientistsData = await getScientists()
    res.json(scientistsData)
});

mongoose.connect(
    `mongodb+srv://${username}:${password}@${database}.fm1e1.mongodb.net/${database}?retryWrites=true&w=majority&appName=${database}`
).then(async () => {
    console.log('MongoDB Connection successful.')
    
    console.log('Fetching and logging crew data...')
    
    await logAllData();
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch((error: Error) => {
    console.error('MongoDB connection error:', error)
});

async function logAllData() {
    try {
        const miners = await getMiners()
        const engineers = await getEngineers()
        const scientists = await getScientists()

        console.log('\n--- Miners Data ---')
        console.log(miners)
        
        console.log('\n--- Engineers Data ---')
        console.log(engineers)

        console.log('\n--- Scientists Data ---')
        console.log(scientists)

    } catch (error) {
        console.error('Error during data fetching:', error)
    }
};