/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { WorktajmTestModule } from '../../../test.module';
import { UserExtraComponent } from '../../../../../../main/webapp/app/entities/user-extra/user-extra.component';
import { UserExtraService } from '../../../../../../main/webapp/app/entities/user-extra/user-extra.service';
import { UserExtra } from '../../../../../../main/webapp/app/entities/user-extra/user-extra.model';

describe('Component Tests', () => {

    describe('UserExtra Management Component', () => {
        let comp: UserExtraComponent;
        let fixture: ComponentFixture<UserExtraComponent>;
        let service: UserExtraService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WorktajmTestModule],
                declarations: [UserExtraComponent],
                providers: [
                    UserExtraService
                ]
            })
            .overrideTemplate(UserExtraComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserExtraComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserExtraService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new UserExtra(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.userExtras[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
