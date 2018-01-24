import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { UserExtra } from './user-extra.model';
import { UserExtraPopupService } from './user-extra-popup.service';
import { UserExtraService } from './user-extra.service';
import { User, UserService } from '../../shared';
import { TimeEntry, TimeEntryService } from '../time-entry';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-user-extra-dialog',
    templateUrl: './user-extra-dialog.component.html'
})
export class UserExtraDialogComponent implements OnInit {

    userExtra: UserExtra;
    isSaving: boolean;

    users: User[];

    activetimeentries: TimeEntry[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private userExtraService: UserExtraService,
        private userService: UserService,
        private timeEntryService: TimeEntryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.timeEntryService
            .query({filter: 'userextra-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.userExtra.activeTimeEntryId) {
                    this.activetimeentries = res.json;
                } else {
                    this.timeEntryService
                        .find(this.userExtra.activeTimeEntryId)
                        .subscribe((subRes: TimeEntry) => {
                            this.activetimeentries = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.userExtra.id !== undefined) {
            this.subscribeToSaveResponse(
                this.userExtraService.update(this.userExtra));
        } else {
            this.subscribeToSaveResponse(
                this.userExtraService.create(this.userExtra));
        }
    }

    private subscribeToSaveResponse(result: Observable<UserExtra>) {
        result.subscribe((res: UserExtra) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: UserExtra) {
        this.eventManager.broadcast({ name: 'userExtraListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    trackTimeEntryById(index: number, item: TimeEntry) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-user-extra-popup',
    template: ''
})
export class UserExtraPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private userExtraPopupService: UserExtraPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.userExtraPopupService
                    .open(UserExtraDialogComponent as Component, params['id']);
            } else {
                this.userExtraPopupService
                    .open(UserExtraDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
