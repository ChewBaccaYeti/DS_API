import mongoose from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { CEC_Type, Prototype } from '../CEC.interface';

const Scientist = mongoose.model('Scientist', CEC_schema, 'Scientists');

export const fetchScientists = async () => {
    try {
        const scientistsData: CEC_Type[] = await Scientist.find() as CEC_Type[];
        console.log('Scientists: ', scientistsData);

        const scientistsArray = scientistsData.map((scientist: CEC_Type) => {
            return new Prototype(
                scientist.name,
                scientist.role,
                scientist.avatar,
                scientist.species,
                scientist.citizenship,
                scientist.rank,
                scientist.directive,
                scientist.id,
                scientist.birthdate,
                scientist.experience,
                scientist.certifications,
                scientist.equipment,
                scientist.activeStatus,
                scientist.lastMission
            );
        });

        scientistsArray.forEach(scientist => scientist.RIG_data());
    } catch (error) {
        console.error(error);
    }
};

export default Scientist;
