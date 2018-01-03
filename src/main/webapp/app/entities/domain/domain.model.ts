import { BaseEntity, User } from './../../shared';

export class Domain implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public addressId?: number,
        public customers?: BaseEntity[],
        public authorizedUsers?: User[],
    ) {
    }
}
