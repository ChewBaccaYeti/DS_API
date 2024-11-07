import { Schema } from 'mongoose';

export const certificationSchema = new Schema({
    title: { type: String, required: true },
    dateObtained: { type: Date, required: true },
});

export const equipmentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    acquired: { type: Date, required: true },
});

export const lastMissionSchema = new Schema({
    missionName: String,
    completedDate: Date,
});

export const CEC_schema = new Schema({
    name: { type: String, required: true },
    role: {
        name: { type: String, required: true },
        symbol: { type: String, required: true },
    },
    avatar: { type: String, required: true },
    species: { type: String, required: true },
    citizenship: { type: String, required: true },
    rank: { type: Number, min: 0, required: true },
    directive: { type: String, required: true },
    id: { type: String, required: true },
    birthdate: { type: Date, required: true },
    experience: {
        years: { type: Number, required: true },
        skills: { type: [String], required: true },
    },
    certifications: [certificationSchema],
    equipment: [equipmentSchema],
    activeStatus: { type: Boolean, required: true },
    lastMission: [lastMissionSchema],
});
