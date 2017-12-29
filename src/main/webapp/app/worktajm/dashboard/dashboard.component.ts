import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';

import { WorktajmDashboardService } from './dashboard.service';
import { EMAIL_NOT_FOUND_TYPE } from '../../shared';

@Component({
    selector: 'jhi-dashboard',
    templateUrl: './dashboard.component.html'
})
export class WorktajmDashboardComponent implements OnInit, AfterViewInit {
    error: string;
    errorEmailNotExists: string;
    resetAccount: any;
    success: string;
    date: string;

    constructor(
        private worktajmDashboardService: WorktajmDashboardService
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    requestReset() {
    }
}
