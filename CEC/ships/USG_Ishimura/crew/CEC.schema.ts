import { Schema } from 'mongoose';
import type { CrewMember } from './CEC.interface';

export const certificationSchema = new Schema(
    {
        title: { type: String, required: true },
        dateObtained: { type: Date, required: true },
    },
    { _id: false },
);

export const equipmentSchema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        acquired: { type: Date, required: true },
    },
    { _id: false },
);

export const lastMissionSchema = new Schema(
    {
        missionName: { type: String, required: true },
        completedDate: { type: Date, required: true },
    },
    { _id: false },
);

export const roleSchema = new Schema(
    {
        name: { type: String, required: true },
        symbol: { type: String, required: true },
    },
    { _id: false },
);

export const experienceSchema = new Schema(
    {
        years: { type: Number, required: true },
        skills: { type: [String], required: true },
    },
    { _id: false },
);

// Typed via generic so mongoose infers required nested fields instead of
// widening them to `T | null | undefined`.
export const CEC_schema = new Schema<CrewMember>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    species: { type: String, required: true },
    citizenship: { type: String, required: true },
    rank: { type: Number, min: 0, required: true },
    directive: { type: String, required: true },
    birthdate: { type: Date, required: true },
    activeStatus: { type: Boolean, required: true },
    role: { type: roleSchema, required: true },
    experience: { type: experienceSchema, required: true },
    certifications: { type: [certificationSchema], default: [] },
    equipment: { type: [equipmentSchema], default: [] },
    lastMission: { type: [lastMissionSchema], default: [] },
});
