import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorktajmSharedModule } from '../../shared';
import { WorktajmAdminModule } from '../../admin/admin.module';
import {
} from './';

const ENTITY_STATES = [
];

@NgModule({
    imports: [
        WorktajmSharedModule,
        WorktajmAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmEntitiesModule {}
