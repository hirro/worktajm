import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Project } from '../../entities/project/project.model';
import { ResponseWrapper} from '../../shared';
import { UserExtra } from '../../entities/worktajm/user-extra.model';

@Injectable()
export class WorktajmDashboardService {

    private projectsResourceUrl = SERVER_API_URL + 'api/projects';
    private accountResourceUrl = SERVER_API_URL + 'api/account';
    private userExtraResourceUrl = SERVER_API_URL + 'api/user-extras';

    constructor(private http: Http) { }

    update(userExtra: UserExtra): Observable<UserExtra> {
        const copy = this.convert(userExtra);
        return this.http.put(this.userExtraResourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(): Observable<UserExtra> {
        return this.http.get(`${this.userExtraResourceUrl}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    /**
     * Convert a returned JSON object to UserExtra.
     */
    private convertItemFromServer(json: any): UserExtra {
        const entity: UserExtra = Object.assign(new UserExtra(), json);
        return entity;
    }

    /**
     * Convert a UserExtra to a JSON which can be sent to the server.
     */
    private convert(userExtra: UserExtra): UserExtra {
        const copy: UserExtra = Object.assign({}, userExtra);
        return copy;
    }

}
