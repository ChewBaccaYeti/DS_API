require('dotenv').config({ path: '.env' });

import mongoose from 'mongoose';
import pipe from '../pipe/pipe';
import { log } from '../utils/log';

const username = process.env.MONGO_CEC_ADMIN;
const password = process.env.MONGO_CEC_PASS;
const connection = process.env.MONGO_CEC_CONN;
const database = process.env.MONGO_CEC_DB;
const port = process.env.APP_PORT;

if (!username || !password || !connection || !database) {
    throw new Error(
        '!!!One or more MongoDB connection environment variables are undefined!!!',
    );
}

mongoose
    .connect(
        `mongodb+srv://${username}:${password}@${connection}.fm1e1.mongodb.net/${database}?retryWrites=true&w=majority&appName=${connection}`,
    )
    .then(() => {
        log.info('[MongoDB connection successful.]');

        const app = pipe();

        app.listen(port, () => {
            log.verbose(`[Server running at http://localhost:${port}]`);
            log.info(`[API docs at http://localhost:${port}/api/docs]`);
            log.info(`[Health at http://localhost:${port}/api/health]`);
        });
    })
    .catch((error: Error) => {
        log.error('MongoDB connection error:', error);
    });
