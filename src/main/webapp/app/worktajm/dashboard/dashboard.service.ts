import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import {Project, ProjectService} from '../../entities/project';
import { UserExtra } from '../../entities/worktajm';
import {TimeEntry, TimeEntryService} from '../../entities/time-entry';
import {JhiAlertService} from 'ng-jhipster';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class WorktajmDashboardService {
    private projectsUpdated = new Subject<Project[]>();
    projectsUpdated$ = this.projectsUpdated.asObservable();
    private timeEntriesUpdated = new Subject<TimeEntry[]>();
    timeEntriesUpdated$ = this.timeEntriesUpdated.asObservable();
    private userExtraResourceUrl = SERVER_API_URL + 'api/user-extras';
    private startProjectResourceUrl = SERVER_API_URL + 'api/worktajm/startProject';
    private stopProjectResourceUrl = SERVER_API_URL + 'api/worktajm/stopProject';
    private projects: Project[] = [];
    private userExtra: UserExtra;
    private activeTimeEntry: TimeEntry;
    private timeEntries: TimeEntry[] = [];

    private static convertUserExtraFromServer(json: any): UserExtra {
        return Object.assign(new UserExtra(), json);
    }

    private static convertUserExtra(userExtra: UserExtra): UserExtra {
        return Object.assign({}, userExtra);
    }

    private static convertProject(project: Project) {
        return Object.assign({}, project);
    }

    private static convertTimeEntryFromServer(json: any) {
        return Object.assign(new TimeEntry(), json);
    }

    constructor(private http: HttpClient,
                private projectService: ProjectService,
                private jhiAlertService: JhiAlertService,
                private timeEntryService: TimeEntryService
    ) {
        this.loadProjects();
    }

    private loadProjects() {
        this.projectService.query()
            .subscribe(
                (res: HttpResponse<Project[]>) => this.onListAllMyProjectsSuccess(res.body),
                (error: any) => this.onListAllMyProjectsError(error)
            );

        console.log('Loading user extra');
        this.getUserExtraForCurrentUser()
            .subscribe(
                (res: UserExtra) => this.onGetUserExtrasSuccess(res),
                (error: any) => this.onGetUserExtrasError(error)
            );

    }

    update(userExtra: UserExtra): Observable<UserExtra> {
        const copy = WorktajmDashboardService.convertUserExtra(userExtra);
        return this.http.put<UserExtra>(this.userExtraResourceUrl, copy).map((res: UserExtra) => {
            return WorktajmDashboardService.convertUserExtraFromServer(res);
        });
    }

    getUserExtraForCurrentUser(): Observable<UserExtra> {
        return this.http.get<UserExtra>(`${this.userExtraResourceUrl}`).map((res: UserExtra) => {
            return WorktajmDashboardService.convertUserExtraFromServer(res);
        });
    }

    private stopProject(project: Project): Observable<TimeEntry> {
        const copy = WorktajmDashboardService.convertProject(project);
        return this.http.post<TimeEntry>(`${this.stopProjectResourceUrl}/${project.id}`, copy)
            .map((res: TimeEntry) => {
                return WorktajmDashboardService.convertTimeEntryFromServer(res);
            });
    }

    private startProject(project: Project): Observable<TimeEntry> {
        const copy = WorktajmDashboardService.convertProject(project);
        return this.http.post<TimeEntry>(`${this.startProjectResourceUrl}/${project.id}`, copy)
            .map((res: TimeEntry) => {
                return WorktajmDashboardService.convertTimeEntryFromServer(res);
            });
    }

    private onListAllMyProjectsSuccess(data: Project[]) {
        console.log('Loaded projects successfully.');
        this.projects = data;
        for (const p of data) {
            console.log(`Name: ${p.name}, IsActive: ${p.active}`);
        }
        this.projectsUpdated.next(this.projects.slice());
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
                p.active = (p.id === this.activeTimeEntry.projectId);
            }
        }
    }

    private onFindActiveTimeEntryError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    onProjectStarted(project: Project) {
        console.log('onProjectStarted');
        this.startProject(project)
            .subscribe(
                (res: TimeEntry) => {
                    this.activeTimeEntry = res;
                    this.updateProjects();
                    this.timeEntries.push(res);
                    this.timeEntriesUpdated.next(this.timeEntries);
                },
                (error: any) => {
                    this.jhiAlertService.error(error.message, null, null);
                }
            );
    }

    onProjectStopped(project: Project) {
        console.log('stopProject');
        this.stopProject(project)
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
            project.active = (activeProjectId === project.id);
        }
    }

    setSelectedDate(date: Date) {
        this.timeEntryService.getAllBetweenDates(date).subscribe(
            (res: HttpResponse<TimeEntry[]>) => this.onLoadedTimeEntriesSuccess(res.body, res.headers),
            (error: any) => this.onLoadedTimeEntriesError(error)
        );
    }

    private onLoadedTimeEntriesSuccess(data: TimeEntry[], headers) {
        this.timeEntries = data;
        this.timeEntriesUpdated.next(this.timeEntries.slice());
    }

    private onLoadedTimeEntriesError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    getProjects(): Project[] {
        return this.projects.slice();
    }
}
