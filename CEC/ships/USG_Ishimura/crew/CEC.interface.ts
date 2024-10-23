export interface CEC_Type {
    name: string
    role: {
        name: string
        symbol: string
    }
    avatar: string
    species: string
    citizenship: string
    rank: number
    directive: string
    id: string
    birthdate: Date
    experience: {
        years: number
        skills: string[]
    }
    certifications: {
        title: string
        dateObtained: Date
    }[]
    equipment: {
        name: string
        type: string
        acquired: Date
    }[]
    activeStatus: boolean
    lastMission: {
        missionName: string
        completedDate: Date
    }
};

export class Prototype {
    name: string
    role: object
    avatar: string
    species: string
    citizenship: string
    rank: number
    directive: string
    id: string
    birthdate: Date
    experience: object
    certifications: object
    equipment: object
    activeStatus: boolean
    lastMission: object

    constructor(
        name: string,
        role: object,
        avatar: string,
        species: string,
        citizenship: string,
        rank: number,
        directive: string,
        id: string,
        birthdate: Date,
        experience: object,
        certifications: object,
        equipment: object,
        activeStatus: boolean,
        lastMission: object
    ) {
        this.name = name
        this.role = role
        this.avatar = avatar
        this.species = species
        this.citizenship = citizenship
        this.rank = rank
        this.directive = directive
        this.id = id
        this.birthdate = birthdate
        this.experience = experience
        this.certifications = certifications
        this.equipment = equipment
        this.activeStatus = activeStatus
        this.lastMission = lastMission
    }

    RIG_data() {
        console.log(this)
    }
};