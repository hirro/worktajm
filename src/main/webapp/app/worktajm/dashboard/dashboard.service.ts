import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Project } from '../../entities/project/project.model';
import { ResponseWrapper} from '../../shared';

@Injectable()
export class WorktajmDashboardService {

    private projectsResourceUrl = SERVER_API_URL + 'api/projects';
    private accountResourceUrl = SERVER_API_URL + 'api/account';

    constructor(private http: Http) {}

    getUserExtra(req?: any): Observable<ResponseWrapper> {
        return this.http.get(this.projectsResourceUrl)
            .map((res: Response) => this.convertResponse(res));
    }

    listAllMyProjects(req?: any): Observable<ResponseWrapper> {
        return this.http.get(this.projectsResourceUrl)
            .map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }


    /**
     * Convert a returned JSON object to Project.
     */
    private convertItemFromServer(json: any): Project {
        const entity: Project = Object.assign(new Project(), json);
        return entity;
    }

    /**
     * Convert a Project to a JSON which can be sent to the server.
     */
    private convert(project: Project): Project {
        const copy: Project = Object.assign({}, project);
        return copy;
    }

}
