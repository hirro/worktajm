import { BaseEntity, User } from './../../shared';

export class Project implements BaseEntity {
    private active: boolean;
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public hourlyRate?: number,
        public projectMembers?: User[],
        public customerId?: number,
    ) {
        this.active = false;
    }

    setActive(active: boolean) {
        this.active = active;
    }

    isActive() : boolean {
        return this.active;
    }
}
