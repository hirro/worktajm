import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project} from '../../../entities/project';
import {TimeEntry} from '../../../entities/time-entry';

@Component({
  selector: 'jhi-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit {

  @Input() projects: Project[];
  @Input() activeTimeEntry: TimeEntry;
  @Output() startProject = new EventEmitter<Project>();
  @Output() stopProject = new EventEmitter<Project>();

  constructor() {
  }

  ngOnInit() {
  }

  start(project: Project) {
    console.log(`start: ${project.name}`);
    this.startProject.emit(project);
  }

  stop(project: Project) {
    console.log(`stop: ${project.name}`);
    this.stopProject.emit(project);
  }
}
