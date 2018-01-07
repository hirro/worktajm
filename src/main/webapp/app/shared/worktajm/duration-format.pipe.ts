import { Pipe, PipeTransform } from '@angular/core';
import {Duration} from 'moment';
import moment = require('moment');

@Pipe({name: 'durationFormat'})
export class DurationFormatPipe implements PipeTransform {
    transform(duration: Duration): string {
        return '' + moment.duration(duration, 'minutes').asHours();
    }
}
