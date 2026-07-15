import { useQuery } from '@tanstack/react-query';
import { apiGet, type Paginated } from '../../../../lib/api';

export type CrewRole = 'miners' | 'engineers' | 'scientists';

export interface CrewMember {
    _id: string;
    id: string;
    name: string;
    rank: number;
    role: { name: string; symbol: string };
    avatar: string;
    species: string;
    citizenship: string;
    directive: string;
    birthdate: string;
    experience: { years: number; skills: string[] };
    certifications: Array<{ title: string; dateObtained: string }>;
    equipment: Array<{ name: string; type: string; acquired: string }>;
    activeStatus: boolean;
    lastMission?: Array<{ missionName: string; completedDate: string }>;
}

interface UseCrewOptions {
    page?: number;
    limit?: number;
}

export function useCrew(role: CrewRole, options: UseCrewOptions = {}) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 50;

    return useQuery({
        queryKey: ['crew', role, page, limit],
        queryFn: () =>
            apiGet<Paginated<CrewMember>>(`/api/${role}`, { page, limit }),
    });
}
