import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TimeEntry } from './time-entry.model';
import { TimeEntryPopupService } from './time-entry-popup.service';
import { TimeEntryService } from './time-entry.service';
import { Project, ProjectService } from '../project';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-time-entry-dialog',
    templateUrl: './time-entry-dialog.component.html'
})
export class TimeEntryDialogComponent implements OnInit {

    timeEntry: TimeEntry;
    isSaving: boolean;

    projects: Project[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private timeEntryService: TimeEntryService,
        private projectService: ProjectService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.projectService.query()
            .subscribe((res: HttpResponse<Project[]>) => { this.projects = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.timeEntry.id !== undefined) {
            this.subscribeToSaveResponse(
                this.timeEntryService.update(this.timeEntry));
        } else {
            this.subscribeToSaveResponse(
                this.timeEntryService.create(this.timeEntry));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<TimeEntry>>) {
        result.subscribe((res: HttpResponse<TimeEntry>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: TimeEntry) {
        this.eventManager.broadcast({ name: 'timeEntryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProjectById(index: number, item: Project) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-time-entry-popup',
    template: ''
})
export class TimeEntryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private timeEntryPopupService: TimeEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.timeEntryPopupService
                    .open(TimeEntryDialogComponent as Component, params['id']);
            } else {
                this.timeEntryPopupService
                    .open(TimeEntryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
