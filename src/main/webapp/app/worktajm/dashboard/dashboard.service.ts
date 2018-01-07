import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Project } from '../../entities/project/project.model';
import { UserExtra } from '../../entities/worktajm/user-extra.model';
import {TimeEntry} from '../../entities/time-entry/time-entry.model';

@Injectable()
export class WorktajmDashboardService {

    private userExtraResourceUrl = SERVER_API_URL + 'api/user-extras';
    private startProjectResourceUrl = SERVER_API_URL + 'api/worktajm/startProject';
    private stopProjectResourceUrl = SERVER_API_URL + 'api/worktajm/stopProject';

    constructor(private http: Http) { }

    update(userExtra: UserExtra): Observable<UserExtra> {
        const copy = this.convertUserExtra(userExtra);
        return this.http.put(this.userExtraResourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertUserExtraFromServer(jsonResponse);
        });
    }

    find(): Observable<UserExtra> {
        return this.http.get(`${this.userExtraResourceUrl}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertUserExtraFromServer(jsonResponse);
        });
    }

    stopProject(project: Project): Observable<TimeEntry> {
        const copy = this.convertProject(project);
        return this.http.post(`${this.stopProjectResourceUrl}/${project.id}`, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertTimeEntryFromServer(jsonResponse);
        });
    }

    startProject(project: Project): Observable<TimeEntry> {
        const copy = this.convertProject(project);
        return this.http.post(`${this.startProjectResourceUrl}/${project.id}`, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertTimeEntryFromServer(jsonResponse);
        });
    }

    private convertUserExtraFromServer(json: any): UserExtra {
        const entity: UserExtra = Object.assign(new UserExtra(), json);
        return entity;
    }

    private convertUserExtra(userExtra: UserExtra): UserExtra {
        const copy: UserExtra = Object.assign({}, userExtra);
        return copy;
    }

    private convertProject(project: Project) {
        const copy: Project = Object.assign({}, project);
        return copy;
    }

    private convertTimeEntryFromServer(json: any) {
        const entity: TimeEntry = Object.assign(new TimeEntry(), json);
        return entity;
    }
}
