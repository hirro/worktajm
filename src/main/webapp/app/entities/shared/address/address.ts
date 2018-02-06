export class Address {
    constructor(
        public organizationNumber?: string,
        public addressLine1?: string,
        public addressLine2?: string,
        public addressLine3?: string,
        public city?: string,
        public zipOrPostcode?: string,
        public stateProvinceCounty?: string,
        public country?: string,
        public addressDetails?: string,
    ) {
    }
}
