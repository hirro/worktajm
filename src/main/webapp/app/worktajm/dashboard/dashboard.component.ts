import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';

import { WorktajmDashboardService } from './dashboard.service';
import { Project } from '../../entities/project';
import { ITEMS_PER_PAGE, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-dashboard',
    templateUrl: './dashboard.component.html'
})
export class WorktajmDashboardComponent implements OnInit, AfterViewInit {
    error: string;
    success: string;
    date: string;
    projects: Project[];
    itemsPerPage: any;

    constructor(
        private worktajmDashboardService: WorktajmDashboardService,
        private jhiAlertService: JhiAlertService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    loadAll() {
        this.worktajmDashboardService.listAllMyProjects()
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    ngOnInit() {
        this.loadAll();
    }

    ngAfterViewInit() {
    }

    private onSuccess(data, headers) {
        this.projects = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
