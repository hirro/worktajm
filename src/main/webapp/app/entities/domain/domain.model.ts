import { BaseEntity, User } from './../../shared';
import { Address } from '../shared/address/address';

export class Domain implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public address?: Address,
        public customers?: BaseEntity[],
        public authorizedUsers?: User[],
    ) {
    }
}
