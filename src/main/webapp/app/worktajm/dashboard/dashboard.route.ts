import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Route} from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { WorktajmDashboardComponent } from './dashboard.component';

@Injectable()
export class TimeEntryResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const worktajmDashboardRoute: Route = {
    path: 'dashboard',
    component: WorktajmDashboardComponent,
    resolve: {
        'pagingParams': TimeEntryResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'worktajmApp.timeEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
};
