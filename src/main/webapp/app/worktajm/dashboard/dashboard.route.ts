import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { WorktajmDashboardComponent } from './dashboard.component';

export const worktajmDashboardRoute: Route = {
    path: 'dashboard',
    component: WorktajmDashboardComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.account.password'
    },
    canActivate: [UserRouteAccessService]
};
