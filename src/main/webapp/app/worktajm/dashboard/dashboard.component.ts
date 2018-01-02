import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { WorktajmDashboardService } from './dashboard.service';
import { EMAIL_NOT_FOUND_TYPE } from '../../shared';
import { Project } from '../../entities/project';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

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
            );;
    }

    ngOnInit() {
        this.loadAll();
    }

    ngAfterViewInit() {
    }

    private isProjectActive(project: Project) : boolean {
        return false;
    }

    private onSuccess(data, headers) {
        this.projects = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
