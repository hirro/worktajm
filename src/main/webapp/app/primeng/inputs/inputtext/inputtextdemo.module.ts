import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorktajmSharedModule } from '../../../shared';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/components/button/button';
import {GrowlModule} from 'primeng/components/growl/growl';
import {WizardModule} from 'primeng-extensions/components/wizard/wizard.module';

import {
    InputTextDemoComponent,
    inputTextDemoRoute
} from './';

const primeng_STATES = [
    inputTextDemoRoute
];

@NgModule({
    imports: [
        WorktajmSharedModule,
        FormsModule,
        InputTextModule,
        GrowlModule,
        ButtonModule,
        WizardModule,
        RouterModule.forRoot(primeng_STATES, { useHash: true })
    ],
    declarations: [
        InputTextDemoComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmInputTextDemoModule {}
