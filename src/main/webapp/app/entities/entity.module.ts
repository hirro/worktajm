import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { WorktajmAddressModule } from './address/address.module';
import { WorktajmProjectModule } from './project/project.module';
import { WorktajmCustomerModule } from './customer/customer.module';
import { WorktajmTimeEntryModule } from './time-entry/time-entry.module';
import { WorktajmDomainModule } from './domain/domain.module';
import { WorktajmUserExtraModule } from './user-extra/user-extra.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        WorktajmAddressModule,
        WorktajmProjectModule,
        WorktajmCustomerModule,
        WorktajmTimeEntryModule,
        WorktajmDomainModule,
        WorktajmUserExtraModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmEntityModule {}
