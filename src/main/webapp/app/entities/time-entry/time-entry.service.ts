import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { TimeEntry } from './time-entry.model';
import { createRequestOption } from '../../shared';
import * as moment from 'moment';

export type EntityResponseType = HttpResponse<TimeEntry>;
export type EntityResponseTypes = HttpResponse<TimeEntry[]>;

@Injectable()
export class TimeEntryService {

    private resourceUrl =  SERVER_API_URL + 'api/time-entries';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/time-entries';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(timeEntry: TimeEntry): Observable<EntityResponseType> {
        const copy = this.convert(timeEntry);
        return this.http.post<TimeEntry>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(timeEntry: TimeEntry): Observable<EntityResponseType> {
        const copy = this.convert(timeEntry);
        return this.http.put<TimeEntry>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<TimeEntry>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<TimeEntry[]>> {
        const options = createRequestOption(req);
        return this.http.get<TimeEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<TimeEntry[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<TimeEntry[]>> {
        const options = createRequestOption(req);
        return this.http.get<TimeEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<TimeEntry[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: TimeEntry = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<TimeEntry[]>): HttpResponse<TimeEntry[]> {
        const jsonResponse: TimeEntry[] = res.body;
        const body: TimeEntry[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to TimeEntry.
     */
    private convertItemFromServer(timeEntry: TimeEntry): TimeEntry {
        const copy: TimeEntry = Object.assign({}, timeEntry);
        copy.start = this.dateUtils
            .convertDateTimeFromServer(timeEntry.start);
        copy.end = this.dateUtils
            .convertDateTimeFromServer(timeEntry.end);
        return copy;
    }

    /**
     * Convert a TimeEntry to a JSON which can be sent to the server.
     */
    private convert(timeEntry: TimeEntry): TimeEntry {
        const copy: TimeEntry = Object.assign({}, timeEntry);
        copy.start = this.dateUtils.toDate(timeEntry.start);
        copy.end = this.dateUtils.toDate(timeEntry.end);
        return copy;
    }

    getAllBetweenDates(fromDate: Date, toDate?: Date): Observable<EntityResponseTypes> {
        const options = createRequestOption();
        if (!toDate) {
            toDate = moment(fromDate).add(1, 'd').toDate();
        }
        console.log(`Searching for time entries between: ${fromDate} and ${toDate}`);
        const from: number = moment(fromDate).unix();
        const to: number = moment(toDate).unix();
        return this.http.get<TimeEntry[]>(
            `${this.resourceUrl}/searchBetweenDates?from=${from}&to=${to}`,
            { params: options, observe: 'response' })
            .map((res: HttpResponse<TimeEntry[]>) => this.convertArrayResponse(res));
    }
}
