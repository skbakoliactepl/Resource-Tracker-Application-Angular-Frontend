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
import { UpdateResourceRequest } from '../../models';

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
  imports: [CommonModule, GridModule, MatIconModule, RouterModule, DialogModule, KENDO_BUTTONS, KENDO_ICONS, KENDO_GRID_PDF_EXPORT],
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
  @ViewChild(GridComponent) grid!: GridComponent;
  pdfExport!: PDFExportComponent;

  resources: Resource[] = [];
  public selectedToDelete: number[] = [];
  public resourceIdToView?: number;
  public showConfirmDialog: boolean = false;
  public showBulkConfirmationDialog: boolean = false;

  selectedResource?: Resource;
  resourceToDelete?: Resource;
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
    private router: Router
  ) { }


  ngOnInit() {
    this.loadResources();
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
      this.router.navigate([`/resource-detail/${this.resourceIdToView}`]);
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
    this.router.navigate([`/edit-resource/${resource.resourceID}`]);
  }

  triggerDetail(resource: Resource) {
    console.log("Detail button Triggered!", resource.resourceID);
    this.router.navigate([`/resource-detail/${resource.resourceID}`]);
  };


  getPdfName(): string {
    const pdfName = `resource_list_${new Date().toString()}`;
    return pdfName;
  };


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

