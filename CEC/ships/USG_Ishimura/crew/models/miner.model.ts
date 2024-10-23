import mongoose from 'mongoose';
import { CEC_schema } from '../CEC.schema';
import { CEC_Type, Prototype } from '../CEC.interface';

const Miner = mongoose.model('Miner', CEC_schema, 'Miners');

export const fetchMiners = async () => {
    try {
        const minersData: CEC_Type[] = await Miner.find() as CEC_Type[];
        console.log('Miners: ', minersData);

        const minersArray = minersData.map((miner: CEC_Type) => {
            return new Prototype(
                miner.name,
                miner.role,
                miner.avatar,
                miner.species,
                miner.citizenship,
                miner.rank,
                miner.directive,
                miner.id,
                miner.birthdate,
                miner.experience,
                miner.certifications,
                miner.equipment,
                miner.activeStatus,
                miner.lastMission
            );
        });

        minersArray.forEach(miner => miner.RIG_data());
    } catch (error) {
        console.error(error);
    }
};

export default Miner;
