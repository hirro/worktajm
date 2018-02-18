import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TimeEntry} from '../../../entities/time-entry';
import {WorktajmDashboardService} from '../dashboard.service';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

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
export class TimeEntriesComponent implements OnInit, OnDestroy {
    date: Date;
    timeEntries: TimeEntry[];
    private timeEntriesUpdatedSubscription: Subscription;

    constructor(private dashboardService: WorktajmDashboardService) {
        this.date = new Date();
        this.date.setHours(0, 0, 0, 0);
    }

    ngOnInit() {
        this.timeEntriesUpdatedSubscription = this.dashboardService.timeEntriesUpdated$.subscribe(
            (value: TimeEntry[]) => {
                console.log('Got updated time entry list');
                this.timeEntries = value;
            },
            (any) => {
                console.error('Failed to get time entries');
            }
        );
        this.dashboardService.setSelectedDate(this.date);
    }

    ngOnDestroy(): void {
        this.timeEntriesUpdatedSubscription.unsubscribe();
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

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
    }

    onChangedDate(date: Date) {
        console.log(`TimeEntriesComponent::onChangedDate: ${date}`);
        this.dashboardService.setSelectedDate(date);
    }

    sum(): string {
        const dummyTime = moment(this.date);
        const duration = moment.duration(dummyTime.diff(dummyTime));
        for (const t of this.timeEntries) {
            const start = moment(t.start);
            const end = moment(t.end);
            duration.add(moment.duration(end.diff(start)));
        }
        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
    }

}
