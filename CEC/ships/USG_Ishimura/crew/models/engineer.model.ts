import mongoose from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { processAndLogCrew } from '../crew.helper';

const Engineer = mongoose.model('Engineer', CEC_schema, 'Engineers');

export const protoEngineers = () => processAndLogCrew(Engineer, 'Engineers');

export default Engineer;
