import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';

import { Project, ProjectService } from '../../entities/project';
import { Principal, ITEMS_PER_PAGE, ResponseWrapper } from '../../shared';
import {UserExtra} from '../../entities/worktajm/user-extra.model';
import {TimeEntryService} from '../../entities/time-entry/time-entry.service';
import {TimeEntry} from '../../entities/time-entry/time-entry.model';
import {WorktajmDashboardService} from './dashboard.service';

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
    userExtra: UserExtra;
    activeTimeEntry: TimeEntry;

    constructor(
        private projectService: ProjectService,
        private dashboardService: WorktajmDashboardService,
        private timeEntryService: TimeEntryService,
        private jhiAlertService: JhiAlertService,
        private principal: Principal
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.date = new Date();
    }

    loadAll() {
        this.projectService.query()
            .subscribe(
                (res: ResponseWrapper) => this.onListAllMyProjectsSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onListAllMyProjectsError(res.json)
            );

        this.dashboardService.find()
            .subscribe(
                (res: UserExtra) => this.onGetUserExtrasSuccess(res),
                (res: ResponseWrapper) => this.onGetUserExtrasError(res.json)
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

    private onListAllMyProjectsSuccess(data, headers) {
        this.projects = data;
    }

    private onListAllMyProjectsError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    private onGetUserExtrasSuccess(data) {
        this.userExtra = data;
        if (this.userExtra.activeTimeEntryId) {
            console.log('Has active time entry!');
            // Fetching
            this.timeEntryService.find(this.userExtra.activeTimeEntryId)
                .subscribe(
                    (res: TimeEntry) => this.onFindActiveTimeEntrySuccess(res, null),
                    (res: ResponseWrapper) => this.onFindActiveTimeEntryError(res.json)
                );
        } else {
            console.log('Has no active time entry!');
        }
    }

    private onGetUserExtrasError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    private onFindActiveTimeEntrySuccess(data, headers) {
        this.activeTimeEntry = data;
        if (this.activeTimeEntry.projectId) {
            for (const p of this.projects) {
                p.setActive(p.id === this.activeTimeEntry.projectId);
            }
        }
    }

    private onFindActiveTimeEntryError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    stopProject(project: Project) {
        console.log('stopProject');
        this.dashboardService.stopProject(project)
            .subscribe(
                (res: TimeEntry) => this.onStopProjectSuccess(res),
                (res: ResponseWrapper) => this.onStopProjectError(res.json)
            );
    }

    startProject(project: Project) {
        console.log('startProject');
        this.dashboardService.startProject(project)
            .subscribe(
                (res: TimeEntry) => this.onStartProjectSuccess(res),
                (res: ResponseWrapper) => this.onStartProjectError(res.json)
            );
    }

    private onStopProjectSuccess(res: TimeEntry) {
        console.log('onStopProjectSuccess: ' + res);
        this.activeTimeEntry = null;
        this.updateProjects();
    }

    private updateProjects() {
        const activeProjectId = this.activeTimeEntry ? this.activeTimeEntry.projectId : 0;
        for (const project of this.projects) {
            project.setActive(activeProjectId === project.id);
        }
    }

    private onStopProjectError(json: any) {
    }

    private onStartProjectSuccess(res: TimeEntry) {
        this.activeTimeEntry = res;
        this.updateProjects();
    }

    private onStartProjectError(json: any) {
    }
}
