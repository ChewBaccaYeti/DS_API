import { Model } from 'mongoose';
import { CEC_Type, Prototype } from './CEC.interface';

const mapToPrototype = (member: CEC_Type) => {
    return new Prototype(
        member.name,
        member.role,
        member.avatar,
        member.species,
        member.citizenship,
        member.rank,
        member.directive,
        member.id,
        member.birthdate,
        member.experience,
        member.certifications,
        member.equipment,
        member.activeStatus,
        member.lastMission
    );
};

export const processAndLogCrew = async (model: Model<any>, modelName: string): Promise<void> => {
    try {
        const crewData: CEC_Type[] = await model.find();
        console.log(`${modelName}: `, crewData);
        const crewArray = crewData.map(mapToPrototype);
        crewArray.forEach(member => member.RIG_data());
    } catch (error) {
        console.error(`Error processing and logging ${modelName}:`, error);
    }
};