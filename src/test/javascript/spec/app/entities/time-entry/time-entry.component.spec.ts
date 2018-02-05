/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { WorktajmTestModule } from '../../../test.module';
import { TimeEntryComponent } from '../../../../../../main/webapp/app/entities/time-entry/time-entry.component';
import { TimeEntryService } from '../../../../../../main/webapp/app/entities/time-entry/time-entry.service';
import { TimeEntry } from '../../../../../../main/webapp/app/entities/time-entry/time-entry.model';

describe('Component Tests', () => {

    describe('TimeEntry Management Component', () => {
        let comp: TimeEntryComponent;
        let fixture: ComponentFixture<TimeEntryComponent>;
        let service: TimeEntryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WorktajmTestModule],
                declarations: [TimeEntryComponent],
                providers: [
                    TimeEntryService
                ]
            })
            .overrideTemplate(TimeEntryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TimeEntryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TimeEntryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new TimeEntry(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.timeEntries[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
