import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import { WorktajmSharedModule } from '../../../shared';
import {GrowlModule} from 'primeng/primeng';
import {TieredMenuModule} from 'primeng/components/tieredmenu/tieredmenu';
import {ButtonModule} from 'primeng/components/button/button';
import {WizardModule} from 'primeng-extensions/components/wizard/wizard.module';

import {
    TieredMenuDemoComponent,
    tieredmenuDemoRoute
} from './';

const primeng_STATES = [
    tieredmenuDemoRoute
];

@NgModule({
    imports: [
        WorktajmSharedModule,
        CommonModule,
        BrowserAnimationsModule,
        TieredMenuModule,
        GrowlModule,
        ButtonModule,
        WizardModule,
        RouterModule.forRoot(primeng_STATES, { useHash: true })
    ],
    declarations: [
        TieredMenuDemoComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmTieredMenuDemoModule {}
