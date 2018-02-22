import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { WorktajmProjectModule } from './project/project.module';
import { WorktajmCustomerModule } from './customer/customer.module';
import { WorktajmTimeEntryModule } from './time-entry/time-entry.module';
import { WorktajmDomainModule } from './domain/domain.module';
import { WorktajmEntitiesModule } from './worktajm/entities.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */
import { WorktajmEntitiesSharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        WorktajmProjectModule,
        WorktajmCustomerModule,
        WorktajmTimeEntryModule,
        WorktajmDomainModule,
        WorktajmEntitiesModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
        WorktajmEntitiesSharedModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmEntityModule {}
