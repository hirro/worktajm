import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorktajmSharedModule } from '../shared';

import { PanelModule,
         ButtonModule,
         CalendarModule,
         DataTableModule
       } from 'primeng/primeng';

import {
    WorktajmReportsComponent,
    WorktajmDashboardComponent,
    WorktajmReportsService,
    WorktajmDashboardService,
    worktajmState
} from './';

@NgModule({
    imports: [
        PanelModule,
        ButtonModule,
        CalendarModule,
        DataTableModule,
        WorktajmSharedModule,
        RouterModule.forChild(worktajmState)
    ],
    declarations: [
        WorktajmReportsComponent,
        WorktajmDashboardComponent
    ],
    providers: [
        WorktajmReportsService,
        WorktajmDashboardService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmWorktajmModule {}