import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import {UserExtra} from '../../entities/worktajm';
import {TimeEntryService} from '../../entities/time-entry';
import {TimeEntry} from '../../entities/time-entry';
import { Project, ProjectService } from '../../entities/project';
import {WorktajmDashboardService} from './dashboard.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import {HttpResponse} from '@angular/common/http';

const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');

momentDurationFormatSetup(moment);

@Component({
    selector: 'jhi-dashboard',
    templateUrl: './dashboard.component.html'
})
export class WorktajmDashboardComponent implements OnInit, OnDestroy {

    currentAccount: any;
    timeEntries: TimeEntry[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    projects: Project[];
    user: any;
    userExtra: UserExtra;
    activeTimeEntry: TimeEntry;
    date: Date;

    constructor(
        private projectService: ProjectService,
        private timeEntryService: TimeEntryService,
        private dashboardService: WorktajmDashboardService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.date = new Date();
        this.date.setHours(0, 0, 0, 0);
        this.timeEntries = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {

        this.projectService.query()
            .subscribe(
                (res: HttpResponse<Project[]>) => this.onListAllMyProjectsSuccess(res.body),
                (error: any) => this.onListAllMyProjectsError(error)
            );

        this.dashboardService.find()
            .subscribe(
                (res: UserExtra) => this.onGetUserExtrasSuccess(res),
                (error: any) => this.onGetUserExtrasError(error)
            );

        this.selectedDateChanged(this.date);
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/time-entry'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/time-entry', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.router.navigate(['/time-entry', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInTimeEntries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: TimeEntry) {
        return item.id;
    }
    registerChangeInTimeEntries() {
        this.eventSubscriber = this.eventManager.subscribe('timeEntryListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    onProjectStarted(project: Project) {
        console.log('onProjectStarted');
        this.dashboardService.startProject(project)
            .subscribe(
                (res: TimeEntry) => {
                    this.activeTimeEntry = res;
                    this.updateProjects();
                    this.timeEntries.push(res);
                },
                (error: any) => {
                    this.jhiAlertService.error(error.message, null, null);
                }
            );
    }

    onProjectStopped(project: Project) {
        console.log('stopProject');
        this.dashboardService.stopProject(project)
            .subscribe(
                (res: TimeEntry) => {
                    if (res) {
                        // Find time entry in time entries and stop it
                        for (const timeEntry of this.timeEntries) {
                            if (timeEntry.id === res.id) {
                                timeEntry.end = res.end;
                            }
                        }
                    }
                    this.activeTimeEntry = null;
                    this.updateProjects();
                },
                (error: any) => {
                    this.jhiAlertService.error(error.message, null, null);
                }
            );
    }

    private updateProjects() {
        const activeProjectId = this.activeTimeEntry ? this.activeTimeEntry.projectId : 0;
        for (const project of this.projects) {
            project.setActive(activeProjectId === project.id);
        }
    }

    private onListAllMyProjectsSuccess(data: Project[]) {
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
                    (res: HttpResponse<TimeEntry>) => this.onFindActiveTimeEntrySuccess(res),
                    (error: any) => this.onFindActiveTimeEntryError(error)
                );
        } else {
            console.log('Has no active time entry!');
        }
    }

    private onGetUserExtrasError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    private onFindActiveTimeEntrySuccess(data) {
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

    private onLoadedTimeEntriesSuccess(data: TimeEntry[], headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.timeEntries = data;
    }

    private onLoadedTimeEntriesError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    selectedDateChanged(date: Date) {
        console.log(`WorktajmDashboardComponent::selectedDateChanged: ${date}`);
        this.timeEntryService.getAllBetweenDates(date).subscribe(
            (res: HttpResponse<TimeEntry[]>) => this.onLoadedTimeEntriesSuccess(res.body, res.headers),
            (error: any) => this.onLoadedTimeEntriesError(error)
        );
    }
}
