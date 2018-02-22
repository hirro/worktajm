import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../entities/project';
import {WorktajmDashboardService} from '../dashboard.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'jhi-projects',
    templateUrl: './projects.component.html',
    styles: []
})
export class ProjectsComponent implements OnInit, OnDestroy {

    projects: Project[];
    private projectsUpdatesSubscription: Subscription;

    constructor(private dashboardService: WorktajmDashboardService) {
    }

    ngOnInit() {
        console.log('ngOnInit');
        this.projects = this.dashboardService.getProjects();
        this.projectsUpdatesSubscription = this.dashboardService.projectsUpdated$.subscribe(
            (value: Project[]) => {
                console.log('Got updated projects list');
                this.projects = value;
            },
            (error: any) => {
                console.error('Failed to get project list');
            });
    }

    ngOnDestroy(): void {
        this.projectsUpdatesSubscription.unsubscribe();
    }

    start(project: Project) {
        console.log(`start: ${project.name}`);
        this.dashboardService.onProjectStarted(project);
    }

    stop(project: Project) {
        console.log(`stop: ${project.name}`);
        this.dashboardService.onProjectStopped(project);
    }
}
