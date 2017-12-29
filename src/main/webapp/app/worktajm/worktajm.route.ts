import { Routes } from '@angular/router';

import {
    worktajmDashboardRoute,
    worktajmReportsRoute
} from './';

const WORKTAJM_ROUTES = [
    worktajmDashboardRoute,
    worktajmReportsRoute
];

export const worktajmState: Routes = [{
    path: '',
    children: WORKTAJM_ROUTES
}];
