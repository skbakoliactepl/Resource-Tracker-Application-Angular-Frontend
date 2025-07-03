import { Component } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { Resource } from '../../models/resource.model';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-grid',
  templateUrl: './resource-grid.component.html',
  styleUrls: ['./resource-grid.component.css'],
  standalone: true,
  imports: [CommonModule, GridModule, MatIconModule, RouterModule, DialogModule],
})
export class ResourceGridComponent {
  resources: Resource[] = [];
  constructor(
    private resourceService: ResourceService,
    private router: Router
  ) { }

  showConfirmDialog: boolean = false;
  selectedResource?: Resource;
  resourceToDelete?: Resource;

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

  exportToCSV(): void {
    const csvData = this.convertToCSV(this.resources);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `resources_${new Date().toString()}.csv`);
    a.click();
  };

  private convertToCSV(data: Resource[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => `"${(obj as any)[header]}"`).join(','));

    return [headers.join(',').toUpperCase(), ...rows].join('\r\n');
  }
}

