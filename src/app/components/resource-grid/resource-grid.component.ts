import { Component, ViewEncapsulation } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { Resource } from '../../models/resource.model';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonModule } from '@angular/common';
import { filePdfIcon, fileExcelIcon, fileCsvIcon, dataJsonIcon } from "@progress/kendo-svg-icons";
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_ICON, KENDO_ICONS } from "@progress/kendo-angular-icons";

@Component({
  selector: 'app-resource-grid',
  templateUrl: './resource-grid.component.html',
  styleUrls: ['./resource-grid.component.css'],
  standalone: true,
  imports: [CommonModule, GridModule, MatIconModule, RouterModule, DialogModule, KENDO_BUTTONS, KENDO_ICONS],
  styles: [`
      .export-btn-group {
        font-size: 12px;
        font-weight: 400;
        border-radius: var(--button-radius);
        transition: all 0.3s ease;
        color: white;
        box-shadow: 0 0 0 transparent;
        border: 2px solid var(--primary-color);
        background-color: var(--primary-color);
      } 
      .export-btn-group:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 14px rgba(197, 98, 175, 0.4);
        background-color: var(--primary-color-dark);
        border: 2px solid var(--primary-color-dark);
      }
    `]
})

export class ResourceGridComponent {
  resources: Resource[] = [];
  showConfirmDialog: boolean = false;
  selectedResource?: Resource;
  resourceToDelete?: Resource;
  public exportOptions = [
    {
      text: "Export to PDF",
      svgIcon: filePdfIcon,
      action: () => this.exportToPDF()
    },
    {
      text: "Export to CSV",
      svgIcon: fileCsvIcon,
      action: () => this.exportToCSV()
    },
    {
      text: "Export to JSON",
      svgIcon: dataJsonIcon,
      action: () => this.exportToJSON()
    }
  ];


  constructor(
    private resourceService: ResourceService,
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

  editResource(resource: Resource) {
    // Add Edit Resource Logic
    this.resourceService.update(resource.empId!, resource);
  }

  openConfirmDialog(resource: Resource): void {
    this.resourceToDelete = resource;
    this.showConfirmDialog = true;
  }

  confirmDelete(): void {
    if (this.resourceToDelete) {
      this.resourceService.delete(this.resourceToDelete.empId!).subscribe({
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

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.resourceToDelete = undefined;
  }

  triggerEdit(resource: Resource): void {
    console.log("Triggered Edit button");
    this.resourceService.isResourceSelected = true;
    this.router.navigate([`/edit-resource/${resource.empId}`]);
  }

  triggerDetail(resource: Resource) {
    console.log("Detail button Triggered!", resource.empId);
    this.router.navigate([`/resource-detail/${resource.empId}`]);
  };


  onExportOptionSelected(option: any): void {
    if (option?.action) {
      option.action();
    }
  };

  exportToCSV(): void {
    const csvData = this.convertToCSV(this.resources);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `resources_${new Date().toString()}.csv`);
    a.click();
  };

  exportToPDF(): void { };
  exportToJSON(): void { };

  private convertToCSV(data: Resource[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => `"${(obj as any)[header]}"`).join(','));

    return [headers.join(',').toUpperCase(), ...rows].join('\r\n');
  }
}

