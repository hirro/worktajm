import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorktajmSharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent } from './';

import { ButtonModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PasswordModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';

@NgModule({
    imports: [
        WorktajmSharedModule,
        BrowserAnimationsModule,
        ButtonModule,
        PasswordModule,
        CalendarModule,
        RouterModule.forChild([ HOME_ROUTE ])
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmHomeModule {}
