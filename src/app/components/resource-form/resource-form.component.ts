import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Resource } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { DropDownButton, KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_DATEINPUTS } from "@progress/kendo-angular-dateinputs";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LABEL } from "@progress/kendo-angular-label";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { CreateResourceRequest } from '../../models';

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
    DropDownsModule,
  ],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourceFormComponent implements OnInit {
  resourceForm!: FormGroup;
  selectedResourceId?: string;
  yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false }
  ];


  constructor(
    private fb: FormBuilder,
    protected resourceService: ResourceService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.selectedResourceId = id;
        this.resourceService.getById(id).subscribe((resource) => {
          if (resource.dateOfJoining) {
            // resource.dateOfJoining = new Date(resource.dateOfJoining.split('T')[0]);
            // resource.dateOfJoining = new Date(resource.dateOfJoining);
          }


          const matchingOption = this.yesNoOptions.find(o => o.value === resource.isBillable);
          this.resourceForm.patchValue({
            ...resource,
            isBillable: matchingOption ?? null
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
      name: ['', Validators.required],
      designation: ['', Validators.required],
      reportingTo: ['', Validators.required],
      isBillable: [null, Validators.required],
      skills: [[], Validators.required],
      projectAllocation: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfJoining: [new Date(), Validators.required],
      remarks: ['']
    });
  };

  onSubmit(): void {
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.value as Resource;

      // // Convert dropdown object to boolean
      // formValue.isBillable = formValue.isBillable ?? null;

      // // Convert skills to array of skills
      // if (typeof formValue.skills === 'string') {
      //   formValue.skills = (formValue.skills as string)
      //     .split(',')
      //     .map(skill => skill.trim())
      //     .filter(skill => !!skill);
      // }

      // Determine whether it's an add or update operation
      const isEditMode = !!this.selectedResourceId;

      if (isEditMode) {
        formValue.empId = this.selectedResourceId;
        this.resourceService.update(this.selectedResourceId!, formValue).subscribe({
          next: () => {
            this.afterFormSubmit();
            this.notificationService.show({
              content: "Resource updated successfully!",
              hideAfter: 3000,
              animation: { type: "fade", duration: 400 },
              type: { style: "success", icon: true }
            });
          },
          error: (err) => {
            console.error('Update failed:', err);
            this.notificationService.show({
              content: `Error while updated the resource: ${err}`,
              hideAfter: 3000,
              animation: { type: "fade", duration: 400 },
              type: { style: "error", icon: true }
            });
          }
        });
      } else {
        console.log("FormValue", formValue);
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
      }
    } else {
      this.resourceForm.markAllAsTouched();
    }
  };


  onReset(): void {
    this.resourceForm.reset({
      name: '',
      designation: '',
      reportingTo: '',
      isBillable: null,
      skills: [],
      projectAllocation: '',
      location: '',
      email: '',
      dateOfJoining: '',
      remarks: ''
    });
  };

  onCancel(): void {
    this.router.navigate(['/']);
  };

  onSave(): void {
    console.log("Form Already Reset");
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.value as Resource;
      formValue.isBillable = formValue.isBillable ?? null;
      console.log("formValue", formValue);

      // If editing an existing resource, include its ID
      if (this.selectedResourceId) {
        // Convert skills to array of skills
        if (typeof formValue.skills === 'string') {
          formValue.skills = (formValue.skills as string)
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => !!skill);
        }

        formValue.empId = this.selectedResourceId;
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

  private afterFormSubmit(): void {
    this.resourceForm.reset();
    this.router.navigate(['/']);
  };
}
