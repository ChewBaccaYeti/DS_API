import { model, Model } from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { CrewMember } from '../CEC.interface';
import { processAndLogCrew } from '../crew.helper';

const Scientist: Model<CrewMember> = model<CrewMember>(
    'Scientist',
    CEC_schema,
    'Scientists',
);

export const protoScientists = () => processAndLogCrew(Scientist, 'Scientists');

export default Scientist;
