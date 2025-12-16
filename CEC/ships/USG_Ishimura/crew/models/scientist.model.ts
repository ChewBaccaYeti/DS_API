import mongoose from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { processAndLogCrew } from '../crew.helper';

const Scientist = mongoose.model('Scientist', CEC_schema, 'Scientists');

export const protoScientists = () => processAndLogCrew(Scientist, 'Scientists');

export default Scientist;
