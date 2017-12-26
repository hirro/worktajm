import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import { WorktajmSharedModule } from '../../../shared';
import {GrowlModule} from 'primeng/primeng';
import {SlideMenuModule} from 'primeng/components/slidemenu/slidemenu';
import {ButtonModule} from 'primeng/components/button/button';
import {WizardModule} from 'primeng-extensions/components/wizard/wizard.module';

import {
    SlideMenuDemoComponent,
    slidemenuDemoRoute
} from './';

const primeng_STATES = [
    slidemenuDemoRoute
];

@NgModule({
    imports: [
        WorktajmSharedModule,
        CommonModule,
        BrowserAnimationsModule,
        SlideMenuModule,
        GrowlModule,
        ButtonModule,
        WizardModule,
        RouterModule.forRoot(primeng_STATES, { useHash: true })
    ],
    declarations: [
        SlideMenuDemoComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmSlideMenuDemoModule {}
