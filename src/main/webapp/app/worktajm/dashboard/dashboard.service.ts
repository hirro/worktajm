import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Project } from '../../entities/project';
import { UserExtra } from '../../entities/worktajm';
import { TimeEntry } from '../../entities/time-entry';

@Injectable()
export class WorktajmDashboardService {

    private userExtraResourceUrl = SERVER_API_URL + 'api/user-extras';
    private startProjectResourceUrl = SERVER_API_URL + 'api/worktajm/startProject';
    private stopProjectResourceUrl = SERVER_API_URL + 'api/worktajm/stopProject';

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

    constructor(private http: HttpClient) { }

    update(userExtra: UserExtra): Observable<UserExtra> {
        const copy = WorktajmDashboardService.convertUserExtra(userExtra);
        return this.http.put<UserExtra>(this.userExtraResourceUrl, copy).map((res: UserExtra) => {
            return WorktajmDashboardService.convertUserExtraFromServer(res);
        });
    }

    find(): Observable<UserExtra> {
        return this.http.get<UserExtra>(`${this.userExtraResourceUrl}`).map((res: UserExtra) => {
            return WorktajmDashboardService.convertUserExtraFromServer(res);
        });
    }

    stopProject(project: Project): Observable<TimeEntry> {
        const copy = WorktajmDashboardService.convertProject(project);
        return this.http.post<TimeEntry>(`${this.stopProjectResourceUrl}/${project.id}`, copy)
            .map((res: TimeEntry) => {
                return WorktajmDashboardService.convertTimeEntryFromServer(res);
            });
    }

    startProject(project: Project): Observable<TimeEntry> {
        const copy = WorktajmDashboardService.convertProject(project);
        return this.http.post<TimeEntry>(`${this.startProjectResourceUrl}/${project.id}`, copy)
            .map((res: TimeEntry) => {
                return WorktajmDashboardService.convertTimeEntryFromServer(res);
            });
    }

}
