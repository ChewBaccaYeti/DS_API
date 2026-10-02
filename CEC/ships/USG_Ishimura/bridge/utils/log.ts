import { createLogger } from 'winston';
import winstonDevConsole from '@epegzz/winston-dev-console';

let log = createLogger({ level: 'silly' });
log = winstonDevConsole.init(log);
log.add(
    winstonDevConsole.transport({
        showTimestamps: true,
        addLineSeparation: true,
    }),
);
export { log };
