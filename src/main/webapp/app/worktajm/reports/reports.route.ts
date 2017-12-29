import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { WorktajmReportsComponent } from './reports.component';

export const worktajmReportsRoute: Route = {
    path: 'reports',
    component: WorktajmReportsComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.account.password'
    },
    canActivate: [UserRouteAccessService]
};
