import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ElasticsearchReindexService {

    constructor(
      private http: HttpClient
    ) { }

    reindex(): Observable<Response> {
        return this.http.post<any>('api/elasticsearch/index', {});
    }
}
