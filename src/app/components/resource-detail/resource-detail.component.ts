import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '../../models/resources/resource.model';
import { ResourceService } from '../../services/resource.service';
import { FormsModule } from '@angular/forms';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { DatePickerModule, TimeSelectorComponent } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs'; // for TextArea
import { DialogComponent, KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { UpdateResourceRequest } from '../../models';
import { ResourceViewModel } from '../../models/resources/resource-view.model';


@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextBoxModule,
    DropDownListModule,
    MultiSelectModule,
    DatePickerModule,
    ButtonsModule,
    InputsModule,
    KENDO_DIALOGS,
  ],
  templateUrl: './resource-detail.component.html',
  styleUrl: './resource-detail.component.css'
})
export class ResourceDetailComponent {
  resource?: ResourceViewModel;
  editMode: boolean = false;
  originalResource: ResourceViewModel = {} as ResourceViewModel;
  editedResource: ResourceViewModel = {} as ResourceViewModel;
  showConfirmationDialog: boolean = false;
  dialogAction: 'save' | 'reset' | 'toggle-off' | null = null;

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private notificationService: NotificationService,
  ) { };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = parseInt(params.get('id')!!);
      if (id) {
        this.resourceService.getById(id).subscribe((resource) => {
          this.resource = resource;
          this.resetEditedResource();
        });
      }
    });
  };

  ngOnChanges() {
    this.resetEditedResource();
  }

  toggleEditMode() {
    console.log("modes", this.editMode, this.isModified(), this.showConfirmationDialog);
    if (this.editMode && this.isModified()) {
      this.dialogAction = 'toggle-off';
      this.showConfirmationDialog = true;
    } else {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        this.resetEditedResource();
      }
    }
  }

  saveChanges() {
    this.resource = { ...this.editedResource };
    console.log("Resorce ", this.resource);
    const request = {} as UpdateResourceRequest;
    this.resourceService.update(this.resource.resourceID!!, request).subscribe({
      next: () => {
        this.notificationService.show({
          content: "Resource updated successfully!",
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
    this.editMode = false;
  }

  resetEditedResource() {
    this.editedResource = this.resource ? { ...this.resource } : {} as ResourceViewModel;
    this.originalResource = this.resource ? { ...this.resource } : {} as ResourceViewModel;
  }

  isModified(): boolean {
    return JSON.stringify(this.editedResource) !== JSON.stringify(this.originalResource);
  }

  // Confirmation Dialog Actions
  onDialogClose() {
    this.showConfirmationDialog = false;
    if (this.dialogAction === 'toggle-off') {
      this.editMode = true;
    }

    this.dialogAction = null;
  };

  onDialogAccept() {
    this.showConfirmationDialog = false;
    switch (this.dialogAction) {
      case 'save':
        this.saveChanges();
        break;
      case 'reset':
        this.resetEditedResource();
        break;
      case 'toggle-off':
        this.editMode = false;
        this.resetEditedResource();
        break;
    };
    this.dialogAction = null;
  }
  onDialogDecline() {
    this.showConfirmationDialog = false;
  };
}

