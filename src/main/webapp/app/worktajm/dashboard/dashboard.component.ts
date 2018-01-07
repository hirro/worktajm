import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import {UserExtra} from '../../entities/worktajm/user-extra.model';
import {TimeEntryService} from '../../entities/time-entry/time-entry.service';
import {TimeEntry} from '../../entities/time-entry/time-entry.model';
import { Project, ProjectService } from '../../entities/project';
import {WorktajmDashboardService} from './dashboard.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

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
    currentSearch: string;
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
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
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

        if (this.currentSearch) {
            this.timeEntryService.search({
                page: this.page - 1,
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                (res: ResponseWrapper) => this.onLoadedTimeEntriesSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onLoadedTimeEntriesError(res.json)
            );
            return;
        }
        this.timeEntryService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: ResponseWrapper) => this.onLoadedTimeEntriesSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onLoadedTimeEntriesError(res.json)
        );
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
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
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
        this.currentSearch = query;
        this.router.navigate(['/time-entry', {
            search: this.currentSearch,
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
        this.timeEntries.push(res);
    }

    private onStartProjectError(json: any) {
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

    private onLoadedTimeEntriesSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.timeEntries = data;
    }

    private onLoadedTimeEntriesError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    duration(timeEntry: TimeEntry): string {
        let duration;
        if (timeEntry.end) {
            const start = moment(timeEntry.start);
            const end = moment(timeEntry.end);
            duration = moment.duration(end.diff(start));
        } else {
            const start = moment(timeEntry.start);
            const now = moment(new Date());
            duration = moment.duration(now.diff(start));
        }

        return duration.format('h:mm:ss');
    }
}
