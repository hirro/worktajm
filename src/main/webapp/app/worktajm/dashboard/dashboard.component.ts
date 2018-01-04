import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';

import { WorktajmDashboardService } from './dashboard.service';
import { Project } from '../../entities/project';
import { Principal, AccountService, JhiLanguageHelper, ITEMS_PER_PAGE, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-dashboard',
    templateUrl: './dashboard.component.html'
})
export class WorktajmDashboardComponent implements OnInit, AfterViewInit {
    error: string;
    success: string;
    date: Date;
    projects: Project[];
    itemsPerPage: any;
    user: any;

    constructor(
        private worktajmDashboardService: WorktajmDashboardService,
        private accountService: AccountService,
        private jhiAlertService: JhiAlertService,
        private principal: Principal
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.date = new Date();
    }

    loadAll() {
        this.worktajmDashboardService.listAllMyProjects()
            .subscribe(
                (res: ResponseWrapper) => this.onListAllMyProjectsSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onListAllMyProjectsError(res.json)
            );

        this.accountService.get()
            .subscribe(
                (res: ResponseWrapper) => this.onAccountGetSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onAccountGetError(res.json)
            );
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.user = account;
        });
        this.loadAll();
    }

    ngAfterViewInit() {
    }

    private isProjectActive(project: Project) : boolean {
        return this.user;
    }

    private toggleProject(project: Project) {
        console.log('Toggling project %s', project.name);
    }

    private onListAllMyProjectsSuccess(data, headers) {
        this.projects = data;
    }

    private onListAllMyProjectsError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    private onAccountGetSuccess(data, headers) {
        this.userExtra = data;
    }

    private onAccountGetError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
