import { BaseEntity } from './../../shared';

export class UserExtra implements BaseEntity {
    constructor(
        public id?: number,
        public phone?: string,
        public userId?: number,
        public activeTimeEntryId?: number,
    ) {
    }
}
