import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TimeEntry } from './time-entry.model';
import { TimeEntryService } from './time-entry.service';

@Injectable()
export class TimeEntryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private timeEntryService: TimeEntryService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.timeEntryService.find(id)
                    .subscribe((timeEntryResponse: HttpResponse<TimeEntry>) => {
                        const timeEntry: TimeEntry = timeEntryResponse.body;
                        timeEntry.start = this.datePipe
                            .transform(timeEntry.start, 'yyyy-MM-ddTHH:mm:ss');
                        timeEntry.end = this.datePipe
                            .transform(timeEntry.end, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.timeEntryModalRef(component, timeEntry);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.timeEntryModalRef(component, new TimeEntry());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    timeEntryModalRef(component: Component, timeEntry: TimeEntry): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.timeEntry = timeEntry;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
