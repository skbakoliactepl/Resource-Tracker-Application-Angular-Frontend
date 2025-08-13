import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Kendo UI Imports
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { AdminService } from '../../../services/admin/admin.service';
import { ResourceUserModel } from '../../../models/admin/admin.model';


interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
}

interface Resource {
  resourceId: number;
  fullName: string;
  email: string;
}

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    DropDownListModule,
    ButtonsModule,
    InputsModule,
    TabStripModule
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent {
  searchTerm = '';
  roles = ['Admin', 'Manager', 'User', 'Viewer'];

  // Dummy existing users
  users: User[] = [];

  // Dummy resources (non-users)
  resources: Resource[] = [];

  constructor(private adminService: AdminService) { }
  ngOnInit() {
    this.loadResourcesWithStatusAndRoles();
  }

  loadResourcesWithStatusAndRoles() {
    this.adminService.getAllResourcesWithUserStatusAndRoles().subscribe({
      next: (data: ResourceUserModel[]) => {
        // Separate into users and non-users based on isUser flag
        this.users = data
          .filter(d => d.isUser)
          .map(d => ({
            userId: d.userID || 0,
            username: d.username || '',
            email: d.email || '',
            role: d.roleName || ''
          }));

        this.resources = data
          .filter(d => !d.isUser)
          .map(d => ({
            resourceId: d.resourceID,
            fullName: d.fullName,
            email: d.email
          }));
      },
      error: err => {
        console.error('Failed to load resources:', err);
        // Handle error (show message, etc)
      }
    });
  }


  get filteredUsers(): User[] {
    return this.users.filter(u =>
      u.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredResources(): Resource[] {
    return this.resources.filter(r =>
      r.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  inviteUser(resource: Resource) {
    console.log('Inviting:', resource);
    // TODO: call API to invite user based on resource info
  }

  changeRole(user: User, newRole: string) {
    user.role = newRole;
    console.log('Role changed:', user);
    // TODO: call API to update role for user
  }

  revokeUser(user: User) {
    console.log('Revoking:', user);
    // TODO: call API to revoke user access
  }
}
