import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TimeEntry} from '../../../entities/time-entry';
import {TimeEntryService} from '../../../entities/time-entry/time-entry.service';
import moment = require('moment');
import {ResponseWrapper} from '../../../shared';
import {Duration} from 'moment';

@Component({
    selector: 'jhi-time-entries',
    templateUrl: './time-entries.component.html',
    styles: [`
        .table td.fit,
        .table th.fit {
            white-space: nowrap;
            width: 1%;
        }
        .fa.disabled,
        .fa[disabled],
        .disabled > .fa,
        [disabled] > .fa {
            color: lightgrey;
            /*or*/ opacity: 0.5;
        }
    `]
})
export class TimeEntriesComponent implements OnInit {

    @Input() date: Date;
    @Input() timeEntries: TimeEntry[];
    @Output() onSelectedDateChanged = new EventEmitter<Date>();

    constructor() {
    }

    ngOnInit() {
    }

    duration(timeEntry: TimeEntry): string {
        let duration;
        if (timeEntry.end) {
            const start = moment(timeEntry.start);
            const end = moment(timeEntry.end);
            duration = moment.duration(end.diff(start));
        } else {
            const start = moment(timeEntry.start);
            const now = moment(new Date());
            duration = moment.duration(now.diff(start));
        }

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
    }

    onChangedDate(date: Date) {
        console.log(`TimeEntriesComponent::onChangedDate: ${date}`);
        this.onSelectedDateChanged.emit(date);
    }

    sum(): string {
        const dummyTime = moment(this.date);
        const duration = moment.duration(dummyTime.diff(dummyTime));
        for (const t of this.timeEntries) {
            const start = moment(t.start);
            const end = moment(t.end);
            duration.add(moment.duration(end.diff(start)));
        }
        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
    }

}
