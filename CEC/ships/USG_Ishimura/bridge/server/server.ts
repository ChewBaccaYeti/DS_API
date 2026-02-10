require('dotenv').config({ path: '.env' });

import { createLogger, format, transports } from "winston";
import winstonDevConsole from "@epegzz/winston-dev-console";
import util from "util";

import mongoose from 'mongoose';
import pipe from '../pipe/pipe';

import { getMiners } from '../../crew/controllers/miner.controller';
import { getEngineers } from '../../crew/controllers/engineer.controller';
import { getScientists } from '../../crew/controllers/scientist.controller';

let log = createLogger({
    level: "silly",
});

log = winstonDevConsole.init(log);
log.add(
    winstonDevConsole.transport({
        showTimestamps: false,
        addLineSeparation: true,
    })
);

const username = process.env.MONGO_CEC_ADMIN;
const password = process.env.MONGO_CEC_PASS;
const connection = process.env.MONGO_CEC_CONN;
const database = process.env.MONGO_CEC_DB;
const port = process.env.APP_PORT;

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

        const app = pipe();

        app.listen(port, () => {
            log.info(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        log.error('MongoDB connection error:', error);
    });

async function logAllData() {
    try {
        const miners = await getMiners();
        const engineers = await getEngineers();
        const scientists = await getScientists();

        log.silly('\n═══════════════════════════════════════ CREW DATA SUMMARY ═══════════════════════════════════════');

        log.info('\n🔧 MINERS DATA:');
        log.verbose(util.inspect(miners, { 
            colors: true, 
            depth: 3, 
            compact: false,
            breakLength: 80 
        }));

        log.info('\n⚙️  ENGINEERS DATA:');
        log.verbose(util.inspect(engineers, { 
            colors: true, 
            depth: 3, 
            compact: false,
            breakLength: 80 
        }));

        log.info('\n🧪 SCIENTISTS DATA:');
        log.verbose(util.inspect(scientists, { 
            colors: true, 
            depth: 3, 
            compact: false,
            breakLength: 80 
        }));

        log.silly('\n═══════════════════════════════════════ END OF CREW DATA SUMMARY ═══════════════════════════════════════');

    } catch (error) {
        log.error('Error during data fetching:', error);
    }
}
