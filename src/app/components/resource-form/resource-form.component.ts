import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Resource } from '../../models/resources/resource.model';
import { ResourceService } from '../../services/resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { DropDownButton, KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_DATEINPUTS } from "@progress/kendo-angular-dateinputs";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LABEL } from "@progress/kendo-angular-label";
import { DropDownsModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { CreateResourceRequest, UpdateResourceRequest } from '../../models';
import { KENDO_DIALOGS } from "@progress/kendo-angular-dialog";
import { ManagerService } from '../../services/managers/manager.service';
import { SkillService } from '../../services/skills/skill.service';
import { ProjectService } from '../../services/projects/project.service';
import { LocationService } from '../../services/locations/location.service';
import { ActiveManagerViewModel } from '../../models/managers/active-manager.model';
import { ActiveSkillViewModel } from '../../models/skills/active-skill.model';
import { ActiveProjectViewModel } from '../../models/projects/active-project.model';
import { ActiveLocationViewModel } from '../../models/locations/active-location.model';
import { ActiveDesignationViewModel } from '../../models/designations/active-designation.model';
import { DesignationService } from '../../services/designations/designation.service';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationModule,
    KENDO_DATEINPUTS,
    KENDO_INPUTS,
    KENDO_LABEL,
    KENDO_BUTTONS,
    KENDO_DIALOGS,
    DropDownsModule,
    MultiSelectModule
  ],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css'],
})
export class ResourceFormComponent implements OnInit {
  resourceForm!: FormGroup;
  selectedResourceId?: number;
  yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false }
  ];
  dialogAction: 'save' | 'reset' | null = null;
  showDialog: boolean = false;
  managers: ActiveManagerViewModel[] = [];
  skillsList: ActiveSkillViewModel[] = [];
  projects: ActiveProjectViewModel[] = [];
  locations: ActiveLocationViewModel[] = [];
  designations: ActiveDesignationViewModel[] = [];

  constructor(
    private fb: FormBuilder,
    protected resourceService: ResourceService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private skillService: SkillService,
    private projectService: ProjectService,
    private locationService: LocationService,
    private designationService: DesignationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.managerService.getActiveManagers().subscribe({
      next: (response) => {
        // console.log("Manager", response.data);
        this.managers = response.data;
      },
      error: (err) => {
        console.error('Error fetching managers', err);
      }
    });

    this.skillService.getActiveSkills().subscribe({
      next: (response) => {
        // console.log("Skills", response.data);
        this.skillsList = response.data;
      },
      error: (err) => {
        console.error('Error fetching skills', err);
      }
    });

    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        // console.log("Projects", response.data);
        this.projects = response.data;
      },
      error: (err) => {
        console.error('Error fetching projects', err);
      }
    });

    this.locationService.getActiveLocations().subscribe({
      next: (response) => {
        // console.log("Locations", response.data);
        this.locations = response.data;
      },
      error: (err) => {
        console.error('Error fetching locations', err);
      }
    });

    this.designationService.getActiveDesignations().subscribe({
      next: (response) => {
        // console.log("Designations", response.data);
        this.designations = response.data;
      },
      error: (err) => {
        console.error('Error fetching designations', err);
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id')!!);
      if (id) {
        this.selectedResourceId = id;
        this.resourceService.getFullDetailsById(id).subscribe((resource) => {
          this.resourceForm.patchValue({
            fullName: resource.fullName,
            email: resource.email,
            doj: resource.doj,
            billable: resource.billable,
            remarks: resource.remarks,
            designationID: resource.designation.designationID,
            locationID: resource.location.locationID,
            managerID: resource.manager.managerID,
            skills: resource.skills.map(skill => skill.skillID),
            projects: resource.projects.map(project => project.projectID)
          });
        });
      }
    });
  }

  close() {
    debugger;
  }

  initializeForm() {
    this.resourceForm = this.fb.group({
      fullName: ['', Validators.required],
      designationID: [null, Validators.required],
      managerID: [null, Validators.required],
      billable: [null, Validators.required],
      skills: [[], Validators.required],
      projects: [[], Validators.required],
      locationID: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      doj: [new Date(), Validators.required],
      remarks: ['']
    });
  };

  onSubmit(): void {
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.value as CreateResourceRequest;

      this.resourceService.add(formValue).subscribe({
        next: () => {
          this.afterFormSubmit();
          this.notificationService.show({
            content: "Resource added successfully!",
            type: { style: "success", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
        },
        error: (err) => {
          console.error('Add failed:', err);
          this.notificationService.show({
            content: `Error while adding resource: ${err}`,
            type: { style: "error", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
        }
      });
    } else {
      this.resourceForm.markAllAsTouched();
    }
  };


  onCancel(): void {
    this.router.navigate(['/']);
  };
  onSaveClick() {
    this.dialogAction = 'save';
    this.showDialog = true;
  };
  onResetClick() {
    this.dialogAction = 'reset';
    this.showDialog = true;
  };


  // Confirmation Dialog Actions
  onDialogClose() {
    this.showDialog = false;
  };
  onDialogAccept() {
    this.showDialog = false;
    if (this.dialogAction === 'save') {
      this.onSave();
    } else if (this.dialogAction === 'reset') {
      this.onReset();
    }
    this.dialogAction = null;
  };
  onDialogDecline() {
    this.showDialog = false;
  };

  private afterFormSubmit(): void {
    this.resourceForm.reset();
    this.router.navigate(['/']);
  };

  private onSave(): void {
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.value as UpdateResourceRequest;

      // If editing an existing resource, include its ID
      if (this.selectedResourceId) {
        formValue.resourceID = this.selectedResourceId;
        this.resourceService.update(this.selectedResourceId!, formValue).subscribe({
          next: () => {
            this.resourceService.isResourceSelected = false;
            this.afterFormSubmit();
            this.notificationService.show({
              content: "Resource updated successfully!",
              type: { style: "success", "icon": true },
              hideAfter: 10000,
              animation: { type: "slide", duration: 400 },
            });
          },
          error: (err) => {
            console.error("Update Error", err);
          }
        });
      }
    } else {
      this.notificationService.show({
        content: "Please enter required fields!",
        type: { style: "error", "icon": true },
        hideAfter: 10000,
        animation: { type: "slide", duration: 400 },
      });
    }
  };

  private onReset(): void {
    this.resourceForm.reset({
      fullName: '',
      designationName: '',
      managerName: '',
      billable: null,
      skills: [],
      projects: '',
      locationName: '',
      email: '',
      doj: '',
      remarks: ''
    });
  };
}
