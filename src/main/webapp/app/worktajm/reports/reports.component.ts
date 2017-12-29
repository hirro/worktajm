import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';

import { WorktajmReportsService } from './reports.service';
import { EMAIL_NOT_FOUND_TYPE } from '../../shared';

@Component({
    selector: 'jhi-reports',
    templateUrl: './reports.component.html'
})
export class WorktajmReportsComponent implements OnInit, AfterViewInit {
    error: string;
    errorEmailNotExists: string;
    resetAccount: any;
    success: string;

    constructor(
        private worktajmReportsService: WorktajmReportsService
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    requestReset() {
    }
}
