require('dotenv').config({ path: '.env' });

import mongoose from 'mongoose';
import pipe from '../pipe/pipe';

import { getMiners } from '../../crew/controllers/miner.controller';
import { getEngineers } from '../../crew/controllers/engineer.controller';
import { getScientists } from '../../crew/controllers/scientist.controller';

const username = process.env.MONGO_CEC_ADMIN;
const password = process.env.MONGO_CEC_PASS;
const connection = process.env.MONGO_CEC_CONN;
const database = process.env.MONGO_CEC_DB;
const port = process.env.APP_PORT;

const app = pipe();

if (!username || !password || !connection || !database) {
    throw new Error(
        'One or more MongoDB connection environment variables are undefined',
    );
}

mongoose
    .connect(
        `mongodb+srv://${username}:${password}@${connection}.fm1e1.mongodb.net/${database}?retryWrites=true&w=majority&appName=${connection}`,
    )
    .then(async () => {
        console.log('MongoDB Connection successful.');

        console.log('Fetching and logging crew data...');

        await logAllData();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error('MongoDB connection error:', error);
    });

async function logAllData() {
    try {
        const miners = await getMiners();
        const engineers = await getEngineers();
        const scientists = await getScientists();

        console.log('\n--- Miners Data ---');
        console.log(miners);

        console.log('\n--- Engineers Data ---');
        console.log(engineers);

        console.log('\n--- Scientists Data ---');
        console.log(scientists);
    } catch (error) {
        console.error('Error during data fetching:', error);
    }
}
