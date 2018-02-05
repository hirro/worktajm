import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Domain } from './domain.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Domain>;

@Injectable()
export class DomainService {

    private resourceUrl =  SERVER_API_URL + 'api/domains';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/domains';

    constructor(private http: HttpClient) { }

    create(domain: Domain): Observable<EntityResponseType> {
        const copy = this.convert(domain);
        return this.http.post<Domain>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(domain: Domain): Observable<EntityResponseType> {
        const copy = this.convert(domain);
        return this.http.put<Domain>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Domain>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Domain[]>> {
        const options = createRequestOption(req);
        return this.http.get<Domain[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Domain[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Domain[]>> {
        const options = createRequestOption(req);
        return this.http.get<Domain[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Domain[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Domain = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Domain[]>): HttpResponse<Domain[]> {
        const jsonResponse: Domain[] = res.body;
        const body: Domain[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Domain.
     */
    private convertItemFromServer(domain: Domain): Domain {
        const copy: Domain = Object.assign({}, domain);
        return copy;
    }

    /**
     * Convert a Domain to a JSON which can be sent to the server.
     */
    private convert(domain: Domain): Domain {
        const copy: Domain = Object.assign({}, domain);
        return copy;
    }
}
