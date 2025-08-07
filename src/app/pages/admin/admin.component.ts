import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillModel, SkillService } from './services/skills/skill.service';
import { ProjectModel, ProjectService } from './services/projects/project.service';
import { ManagerModel, ManagerService } from './services/managers/manager.service';
import { LocationModel, LocationService } from './services/locations/location.service';
import { DesignationModel, DesignationService } from './services/designations/designation.service';
import { ProjectFormComponent } from './components/projects/project-form/project-form.component';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectFormComponent,
    ProjectListComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  skillForm!: FormGroup;
  projectForm!: FormGroup;
  managerForm!: FormGroup;
  locationForm!: FormGroup;
  designationForm!: FormGroup;

  skills: SkillModel[] = [];
  projects: ProjectModel[] = [];
  managers: ManagerModel[] = [];
  locations: LocationModel[] = [];
  designations: DesignationModel[] = [];

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private projectService: ProjectService,
    private managerService: ManagerService,
    private locationService: LocationService,
    private designationService: DesignationService
  ) { }


  ngOnInit(): void {
    this.initializeForms();
    this.loadAllData();
  }

  initializeForms() {
    this.skillForm = this.fb.group({ skillName: ['', Validators.required] });
    this.projectForm = this.fb.group({ projectName: ['', Validators.required] });
    this.managerForm = this.fb.group({ managerName: ['', Validators.required] });
    this.locationForm = this.fb.group({ locationName: ['', Validators.required] });
    this.designationForm = this.fb.group({ designationName: ['', Validators.required] });
  }

  loadAllData() {
    this.skillService.getSkills().subscribe(data => this.skills = data);
    this.projectService.getProjects().subscribe(data => this.projects = data);
    this.managerService.getManagers().subscribe(data => this.managers = data);
    this.locationService.getLocations().subscribe(data => this.locations = data);
    this.designationService.getDesignations().subscribe(data => this.designations = data);
  }

  addSkill() {
    if (this.skillForm.valid) {
      this.skillService.addSkill(this.skillForm.value).subscribe(() => {
        this.skillForm.reset();
        this.loadAllData();
      });
    }
  }

  addProject() {
    if (this.projectForm.valid) {
      this.projectService.addProject(this.projectForm.value).subscribe(() => {
        this.projectForm.reset();
        this.loadAllData();
      });
    }
  }

  addManager() {
    if (this.managerForm.valid) {
      this.managerService.addManager(this.managerForm.value).subscribe(() => {
        this.managerForm.reset();
        this.loadAllData();
      });
    }
  }

  addLocation() {
    if (this.locationForm.valid) {
      this.locationService.addLocation(this.locationForm.value).subscribe(() => {
        this.locationForm.reset();
        this.loadAllData();
      });
    }
  }

  addDesignation() {
    if (this.designationForm.valid) {
      this.designationService.addDesignation(this.designationForm.value).subscribe(() => {
        this.designationForm.reset();
        this.loadAllData();
      });
    }
  }
}
