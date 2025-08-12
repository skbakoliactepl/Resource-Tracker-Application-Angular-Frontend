import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Kendo UI Imports
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TabStripModule } from '@progress/kendo-angular-layout';


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
  users: User[] = [
    { userId: 1, username: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { userId: 2, username: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { userId: 3, username: 'Mike Ross', email: 'mike@example.com', role: 'Manager' }
  ];

  // Dummy resources (non-users)
  resources: Resource[] = [
    { resourceId: 101, fullName: 'Rachel Green', email: 'rachel@example.com' },
    { resourceId: 102, fullName: 'Chandler Bing', email: 'chandler@example.com' },
    { resourceId: 103, fullName: 'Phoebe Buffay', email: 'phoebe@example.com' }
  ];

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
  }

  changeRole(user: User, newRole: string) {
    user.role = newRole;
    console.log('Role changed:', user);
  }

  revokeUser(user: User) {
    console.log('Revoking:', user);
  }
}
