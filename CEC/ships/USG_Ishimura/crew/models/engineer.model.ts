import mongoose from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { CEC_Type, Prototype } from '../CEC.interface';

const Engineer = mongoose.model('Engineer', CEC_schema, 'Engineers');

export const fetchEngineers = async () => {
    try {
        const engineersData: CEC_Type[] = await Engineer.find() as CEC_Type[];
        console.log('Engineers: ', engineersData);

        const engineersArray = engineersData.map((engineer: CEC_Type) => {
            return new Prototype(
                engineer.name,
                engineer.role,
                engineer.avatar,
                engineer.species,
                engineer.citizenship,
                engineer.rank,
                engineer.directive,
                engineer.id,
                engineer.birthdate,
                engineer.experience,
                engineer.certifications,
                engineer.equipment,
                engineer.activeStatus,
                engineer.lastMission
            );
        });

        engineersArray.forEach(engineer => engineer.RIG_data());
    } catch (error) {
        console.error(error);
    }
};

export default Engineer;
