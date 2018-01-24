/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { WorktajmTestModule } from '../../../test.module';
import { DomainDetailComponent } from '../../../../../../main/webapp/app/entities/domain/domain-detail.component';
import { DomainService } from '../../../../../../main/webapp/app/entities/domain/domain.service';
import { Domain } from '../../../../../../main/webapp/app/entities/domain/domain.model';

describe('Component Tests', () => {

    describe('Domain Management Detail Component', () => {
        let comp: DomainDetailComponent;
        let fixture: ComponentFixture<DomainDetailComponent>;
        let service: DomainService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WorktajmTestModule],
                declarations: [DomainDetailComponent],
                providers: [
                    DomainService
                ]
            })
            .overrideTemplate(DomainDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DomainDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DomainService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Domain(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.domain).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
