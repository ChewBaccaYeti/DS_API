import { model, Model } from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { CrewMember } from '../CEC.interface';
import { processAndLogCrew } from '../crew.helper';

const Engineer: Model<CrewMember> = model<CrewMember>(
    'Engineer',
    CEC_schema,
    'Engineers',
);

export const protoEngineers = () => processAndLogCrew(Engineer, 'Engineers');

export default Engineer;
