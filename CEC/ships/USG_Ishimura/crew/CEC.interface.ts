// ─── Value objects ──────────────────────────────────────────────────────

export interface Role {
    readonly name: string;
    readonly symbol: string;
}

export interface Experience {
    readonly years: number;
    readonly skills: readonly string[];
}

export interface Certification {
    readonly title: string;
    readonly dateObtained: Date;
}

export interface Equipment {
    readonly name: string;
    readonly type: string;
    readonly acquired: Date;
}

export interface Mission {
    readonly missionName: string;
    readonly completedDate: Date;
}

// ─── Aggregate root ─────────────────────────────────────────────────────

export interface CrewMember {
    readonly id: string;
    readonly name: string;
    readonly avatar: string;
    readonly species: string;
    readonly citizenship: string;
    readonly rank: number;
    readonly directive: string;
    readonly birthdate: Date;
    readonly activeStatus: boolean;
    readonly role: Role;
    readonly experience: Experience;
    readonly certifications: readonly Certification[];
    readonly equipment: readonly Equipment[];
    readonly lastMission: readonly Mission[];
}

// ─── OOP wrapper ────────────────────────────────────────────────────────
// Business methods live on the class. Persistence stays with Mongoose.

export class CrewPrototype implements CrewMember {
    readonly id: string;
    readonly name: string;
    readonly avatar: string;
    readonly species: string;
    readonly citizenship: string;
    readonly rank: number;
    readonly directive: string;
    readonly birthdate: Date;
    readonly activeStatus: boolean;
    readonly role: Role;
    readonly experience: Experience;
    readonly certifications: readonly Certification[];
    readonly equipment: readonly Equipment[];
    readonly lastMission: readonly Mission[];

    constructor(data: CrewMember) {
        this.id = data.id;
        this.name = data.name;
        this.avatar = data.avatar;
        this.species = data.species;
        this.citizenship = data.citizenship;
        this.rank = data.rank;
        this.directive = data.directive;
        this.birthdate = data.birthdate;
        this.activeStatus = data.activeStatus;
        this.role = data.role;
        this.experience = data.experience;
        this.certifications = data.certifications;
        this.equipment = data.equipment;
        this.lastMission = data.lastMission;
    }

    isOfficer(): boolean {
        return this.rank >= 4;
    }

    isActive(): boolean {
        return this.activeStatus;
    }

    lastCompletedMission(): Mission | undefined {
        if (!this.lastMission.length) return undefined;
        return [...this.lastMission].sort(
            (a, b) => b.completedDate.getTime() - a.completedDate.getTime(),
        )[0];
    }

    dumpRigData(): void {
        // Minimal telemetry: crew id, rank, role — never PII beyond canon.
        // Kept as a static snapshot; do not use for production logging.
        console.log(
            `[RIG ${this.id}] ${this.name} — ${this.role.name} · R${this.rank} · ${
                this.activeStatus ? 'ACTIVE' : 'INACTIVE'
            }`,
        );
    }
}
