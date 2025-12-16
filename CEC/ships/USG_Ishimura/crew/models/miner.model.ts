import mongoose from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { processAndLogCrew } from '../crew.helper';

const Miner = mongoose.model('Miner', CEC_schema, 'Miners');

export const protoMiners = () => processAndLogCrew(Miner, 'Miners');

export default Miner;
