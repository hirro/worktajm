import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'jhi-datepicker-popup',
    templateUrl: './datepicker-popup.component.html',
    styles: []
})
export class DatepickerPopupComponent implements OnInit {
    model;
    @Input() selectedDate: Date;
    @Output() onDateUpdated = new EventEmitter<Date>();

    constructor() {
    }

    ngOnInit() {
        if (this.selectedDate) {
            this.model = this.selectedDate;
        } else {
            this.selectToday();
        }
    }

    selectToday() {
        const now = new Date();
        this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    }

    onChangedDate() {
        const date = new Date();
        date.setFullYear(this.model.year, this.model.month - 1, this.model.day);
        date.setHours(0, 0, 0, 0);
        console.log(`DatepickerPopupComponent::onChangedDate: ${date.toString()}`);
        this.onDateUpdated.emit(date);
    }
}
