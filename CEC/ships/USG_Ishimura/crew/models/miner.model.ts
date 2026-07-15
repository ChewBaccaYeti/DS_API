import { model, Model } from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { CrewMember } from '../CEC.interface';
import { processAndLogCrew } from '../crew.helper';

const Miner: Model<CrewMember> = model<CrewMember>(
    'Miner',
    CEC_schema,
    'Miners',
);

export const protoMiners = () => processAndLogCrew(Miner, 'Miners');

export default Miner;
