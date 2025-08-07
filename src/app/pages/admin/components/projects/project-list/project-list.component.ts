import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectModel } from '../../../services/projects/project.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, GridModule, ProjectFormComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  @Input() projects: ProjectModel[] = [];
  @Output() refreshProjects = new EventEmitter<void>();

  showForm = false;
  selectedProject: ProjectModel | null = null;

  openForm() {
    this.selectedProject = null;
    this.showForm = true;
  }

  editProject(project: ProjectModel) {
    this.selectedProject = project;
    this.showForm = true;
  }

  deleteProject(projectId: number) {
    console.log(`Delete project with ID: ${projectId}`);
    // Call delete service and emit refresh if needed
  }

  closeForm(refresh: boolean) {
    this.showForm = false;
    this.selectedProject = null;
    if (refresh) {
      this.refreshProjects.emit();
    }
  }
}
