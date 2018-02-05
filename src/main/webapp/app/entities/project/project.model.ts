import { BaseEntity, User } from './../../shared';

export class Project implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public hourlyRate?: number,
        public projectMembers?: User[],
        public customerId?: number,
    ) {
    }
}
