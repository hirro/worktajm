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

import {TimeEntryResolvePagingParams} from './dashboard/dashboard.route';
import { ProjectsComponent } from './dashboard/projects/projects.component';
import { TimeEntriesComponent } from './dashboard/time-entries/time-entries.component';
import { DatepickerPopupComponent } from './dashboard/time-entries/datepicker-popup/datepicker-popup.component';

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
        WorktajmDashboardComponent,
        ProjectsComponent,
        TimeEntriesComponent,
        DatepickerPopupComponent,
    ],
    providers: [
        WorktajmReportsService,
        WorktajmDashboardService,
        TimeEntryResolvePagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmWorktajmModule {}
