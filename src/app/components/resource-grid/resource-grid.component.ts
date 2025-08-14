import { Component, ViewChild } from '@angular/core';
import { GridComponent, GridModule } from '@progress/kendo-angular-grid';
import { Resource } from '../../models/resources/resource.model';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonModule } from '@angular/common';
import { filePdfIcon, fileCsvIcon, dataJsonIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_ICONS } from "@progress/kendo-angular-icons";
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import {
  KENDO_GRID,
  KENDO_GRID_PDF_EXPORT,
} from "@progress/kendo-angular-grid";
import { pdf } from '@progress/kendo-drawing';
import { NotificationService } from '@progress/kendo-angular-notification';
import { UpdateResourceRequest } from '../../models'; import { DropDownsModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActiveManagerViewModel } from '../../models/managers/active-manager.model';
import { ActiveSkillViewModel } from '../../models/skills/active-skill.model';
import { ActiveProjectViewModel } from '../../models/projects/active-project.model';
import { ActiveLocationViewModel } from '../../models/locations/active-location.model';
import { ActiveDesignationViewModel } from '../../models/designations/active-designation.model';
import { ManagerService } from '../../services/managers/manager.service';
import { SkillService } from '../../services/skills/skill.service';
import { ProjectService } from '../../services/projects/project.service';
import { LocationService } from '../../services/locations/location.service';
import { DesignationService } from '../../services/designations/designation.service';
import { ImportService } from '../../services/import/import.service.ts.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { RoutePaths } from '../../config/route-paths';

type ExportOption = {
  text: string;
  svgIcon: SVGIcon,
  action: () => void;
};

@Component({
  selector: 'app-resource-grid',
  templateUrl: './resource-grid.component.html',
  styleUrls: ['./resource-grid.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    MatIconModule,
    RouterModule,
    DialogModule,
    KENDO_BUTTONS,
    KENDO_ICONS,
    KENDO_GRID_PDF_EXPORT,
    DropDownsModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressBarModule
  ],
  styles: [`
      .export-btn-group {
        border-radius: var(--button-radius);
        color: white;
        border: 2px solid var(--primary-color);
        background-color: var(--primary-color);
      } 
      .export-btn-group:hover {
        background-color: var(--primary-color-dark);
        border: 2px solid var(--primary-color-dark);
      }
    `]
})

export class ResourceGridComponent {
  routePaths = RoutePaths;
  @ViewChild(GridComponent) grid!: GridComponent;
  pdfExport!: PDFExportComponent;

  bulkEditForm!: FormGroup;
  resources: Resource[] = [];
  public selectedToDelete: number[] = [];
  public resourceIdToView?: number;
  public showConfirmDialog: boolean = false;
  public showBulkEditDialog = false;
  public showBulkConfirmationDialog: boolean = false;
  managers: ActiveManagerViewModel[] = [];
  projects: ActiveProjectViewModel[] = [];
  locations: ActiveLocationViewModel[] = [];
  designations: ActiveDesignationViewModel[] = [];

  // Import Variables
  showImportDialog = false;
  selectedFile: File | null = null;
  isUploading = false;
  uploadSuccess = false;
  uploadProgress: number = 0;
  uploadMessage = '';
  skippedResources: any[] = [];

  selectedResource?: Resource;
  resourceToDelete?: Resource;
  yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false }
  ];
  bulkEditModel = {
    billable: null,
    designationID: null,
    locationID: null,
    projectID: null,
    remarks: ''
  };
  public exportOptions: ExportOption[] = [
    {
      text: "PDF",
      svgIcon: filePdfIcon,
      action: () => this.grid.saveAsPDF()
    },
    {
      text: "CSV",
      svgIcon: fileCsvIcon,
      action: () => this.exportToCSV()
    },
    {
      text: "JSON",
      svgIcon: dataJsonIcon,
      action: () => this.exportToJSON()
    }
  ];


  constructor(
    private resourceService: ResourceService,
    private notificationService: NotificationService,
    private router: Router,
    private managerService: ManagerService,
    private skillService: SkillService,
    private projectService: ProjectService,
    private locationService: LocationService,
    private designationService: DesignationService,
    private fb: FormBuilder,
    private importService: ImportService
  ) { }


  ngOnInit() {
    this.bulkEditForm = this.fb.group({
      designationID: [null],
      locationID: [null],
      projectID: [null],
      billable: [null],
      remarks: ""
    });
    this.loadResources();
    this.managerService.getActiveManagers().subscribe({
      next: (response) => {
        console.log("Manager", response.data);
        this.managers = response.data;
      },
      error: (err) => {
        console.error('Error fetching managers', err);
      }
    });

    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        console.log("Projects", response.data);
        this.projects = response.data;
      },
      error: (err) => {
        console.error('Error fetching projects', err);
      }
    });

    this.locationService.getActiveLocations().subscribe({
      next: (response) => {
        console.log("Locations", response.data);
        this.locations = response.data;
      },
      error: (err) => {
        console.error('Error fetching locations', err);
      }
    });

    this.designationService.getActiveDesignations().subscribe({
      next: (response) => {
        console.log("Designations", response.data);
        this.designations = response.data;
      },
      error: (err) => {
        console.error('Error fetching designations', err);
      }
    });
  }

  loadResources() {
    this.resourceService.getAll().subscribe(data => {
      console.log("data", data);
      this.resources = data;
    });
  }

  editResource(resource: UpdateResourceRequest) {
    // Add Edit Resource Logic
    this.resourceService.update(resource.resourceID!, resource);
  }

  openConfirmDialog(resource: Resource): void {
    this.resourceToDelete = resource;
    this.showConfirmDialog = true;
  }

  openBulkEditDialog() {
    this.showBulkEditDialog = true;
  }
  cancelBulkEdit() {
    this.bulkEditForm.reset();
    this.showBulkEditDialog = false;
  }
  submitBulkEdit() {
    if (this.bulkEditForm.valid) {
      const formValues = this.bulkEditForm.value;
      console.log("FormValues", formValues);

      const updates = this.selectedToDelete.map(id => ({
        resourceID: id,
        billable: formValues.billable,
        projectID: formValues.projectID,
        designationID: formValues.designationID,
        locationID: formValues.locationID,
        remarks: formValues.remarks
      }));
      console.log("Bulk update payload", updates);

      this.resourceService.bulkUpdate(updates).subscribe({
        next: (res) => {
          console.log("BULK EDIT RES", res);
          this.showBulkEditDialog = false;
          this.loadResources();
          this.notificationService.show({
            content: `Resource${this.selectedToDelete.length <= 1 ? '' : 's'} updated successfully!`,
            type: { style: "success", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
          this.bulkEditForm.reset();
        },
        error: err => {
          console.error('Bulk update failed', err);
          this.notificationService.show({
            content: `Error while updating resource${this.selectedToDelete.length <= 1 ? '' : 's'} successfully!`,
            type: { style: "error", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
          this.bulkEditForm.reset();
        }
      });
    }
  }

  onRowClick(event: any): void {
    console.log("EVENT", event);
    this.resourceIdToView = event.dataItem.resourceID;
  }

  confirmDelete(): void {
    if (this.resourceToDelete) {
      this.resourceService.delete(this.resourceToDelete.resourceID!).subscribe({
        next: () => {
          this.loadResources();
        },
        error: (err) => {
          console.error('Delete failed: ', err);
        }
      });
    }
    this.showConfirmDialog = false;
  }

  confirmDetail(): void {
    if (!(this.selectedToDelete.length === 0) || !(this.selectedToDelete.length > 1) && (this.resourceIdToView)) {
      this.router.navigate([`${this.routePaths.appBase}/${this.routePaths.resourceDetail.split('/')[0]}/${this.resourceIdToView}`]);
    }
  };

  confirmBulkDelete() {
    console.log("selectedDetele Array", this.selectedToDelete, this.selectedToDelete.length);

    this.showBulkConfirmationDialog = true;
  };

  confirmBulkDeleteAction() {
    console.log("Inside Confirm Delte Action:", this.selectedToDelete);
    if (this.selectedToDelete.length === 0) {
      this.cancelBulkDelete();
      return;
    }
    const empIds = this.selectedToDelete;
    console.log("EDS", empIds);
    if (empIds.length === 1) {
      console.log("only One To Delte", empIds);
      this.resourceService.delete(empIds[0]).subscribe({
        next: () => {
          this.loadResources();
          this.notificationService.show({
            content: "Selected Resource deleted successfully!",
            type: { style: "success", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
          this.cancelBulkDelete();
        },
        error: (err) => {
          console.error('Single delete failed:', err);
          this.notificationService.show({
            content: `Error while deleting resource: ${err}`,
            type: { style: "error", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
          this.cancelBulkDelete();
        }
      });
    }
    else {
      // Bulk delete
      this.resourceService.deleteBulk(empIds).subscribe({
        next: () => {
          this.loadResources();
          this.cancelBulkDelete();
          this.notificationService.show({
            content: "All the selected resources deleted successfully!",
            type: { style: "success", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
        },
        error: (err) => {
          console.error('Bulk delete failed:', err);
          this.notificationService.show({
            content: `Error while deleting resources: ${err}`,
            type: { style: "error", "icon": true },
            hideAfter: 10000,
            animation: { type: "slide", duration: 400 },
          });
          this.cancelBulkDelete();
        }
      });
    }
  };

  cancelBulkDelete() {
    this.selectedToDelete = [];
    this.showBulkConfirmationDialog = false;
  };

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.resourceToDelete = undefined;
  }

  triggerEdit(resource: Resource): void {
    console.log("Triggered Edit button", resource);
    this.resourceService.isResourceSelected = true;
    this.router.navigate([`${this.routePaths.appBase}/${this.routePaths.editResource.split('/')[0]}/${resource.resourceID}`]);
  }

  triggerDetail(resource: Resource) {
    console.log("Detail button Triggered!", resource.resourceID);
    this.router.navigate([`${this.routePaths.appBase}/${this.routePaths.resourceDetail.split('/')[0]}/${resource.resourceID}`]);
  };


  getPdfName(): string {
    const pdfName = `resource_list_${new Date().toString()}`;
    return pdfName;
  };

  // Import Dialog Methods
  openImportDialog() {
    this.showImportDialog = true;
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
    this.uploadSuccess = false;
  }

  closeImportDialog() {
    this.showImportDialog = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadMessage = '';
      this.skippedResources = [];
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadSuccess = false;
    this.uploadMessage = '';
    this.skippedResources = [];

    this.importService.uploadResourceFile(this.selectedFile).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;

          const response = event.body;
          console.log("RESPONSE", response);

          if (response?.success) {
            this.uploadSuccess = true;
            this.uploadMessage = response.message || 'Resource import successful.';
            this.skippedResources = [];
          } else {
            this.uploadSuccess = false;
            this.uploadMessage = response?.message || 'Import completed with issues.';
            this.skippedResources = response?.data || [];

            if (response?.data && response?.data.skippedResources) {
              this.skippedResources = response.data.skippedResources.map((nameOrObj: any) => {
                if (typeof nameOrObj === 'string') {
                  return { fullName: nameOrObj, reason: 'Unknown reason' };
                } else {
                  return nameOrObj;
                }
              });
            }
          }
        }
      },
      error: err => {
        console.error('Upload error', err);
        this.uploadMessage = 'An error occurred during upload.';
        this.uploadSuccess = false;
        this.isUploading = false;
      }
    });
  }


  exportToCSV(): void {
    const csvData = this.convertToCSV(this.resources);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `resources_${new Date().toString()
      }.csv`);
    a.click();
  };

  exportToPDF(): void { };
  exportToJSON(): void {
    const jsonData = JSON.stringify(this.resources, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `resource - list_${new Date().toString()}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  private convertToCSV(data: Resource[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => `"${(obj as any)[header]}"`).join(','));

    return [headers.join(',').toUpperCase(), ...rows].join('\r\n');
  }
}

