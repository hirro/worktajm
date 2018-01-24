/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { WorktajmTestModule } from '../../../test.module';
import { DomainComponent } from '../../../../../../main/webapp/app/entities/domain/domain.component';
import { DomainService } from '../../../../../../main/webapp/app/entities/domain/domain.service';
import { Domain } from '../../../../../../main/webapp/app/entities/domain/domain.model';

describe('Component Tests', () => {

    describe('Domain Management Component', () => {
        let comp: DomainComponent;
        let fixture: ComponentFixture<DomainComponent>;
        let service: DomainService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WorktajmTestModule],
                declarations: [DomainComponent],
                providers: [
                    DomainService
                ]
            })
            .overrideTemplate(DomainComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DomainComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DomainService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Domain(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.domains[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
