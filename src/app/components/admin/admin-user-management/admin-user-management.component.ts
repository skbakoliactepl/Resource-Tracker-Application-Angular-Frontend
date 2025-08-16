import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Kendo UI Imports
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { AdminService } from '../../../services/admin/admin.service';
import { InviteResourceRequestModel, ResourceUserModel, RoleModel, UpdateUserRoleRequest } from '../../../models/admin/admin.model';
import { IconsModule } from '@progress/kendo-angular-icons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { NotificationService } from '@progress/kendo-angular-notification';


interface User {
  userID: number;
  username: string;
  email: string;
  role: RoleModel;
}

interface Resource {
  resourceID: number;
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
    TabStripModule,
    GridModule,
    DialogsModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    ProgressBarModule,
    IconsModule
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent {
  searchTerm = '';
  roles: RoleModel[] = [];

  // Dummy existing users
  users: User[] = [];

  // Dummy resources (non-users)
  resources: Resource[] = [];

  // dialog state
  showInviteDialog = false;
  selectedResource: any;
  selectedRole: RoleModel | null = null;
  sending = false;
  sent = false;
  progressValue = 0;
  progressInterval: any;

  // Confirmation dialog state
  confirmDialogVisible = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmAction: (() => void) | null = null;


  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.loadRoles();
    this.loadResourcesWithStatusAndRoles();
  }

  loadRoles() {
    this.adminService.getAllRoles().subscribe({
      next: (res) => {
        console.log("ROLES", res);
        this.roles = res.data;
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
        this.roles = [];
      }
    });
  }

  loadResourcesWithStatusAndRoles() {
    this.adminService.getAllResourcesWithUserStatusAndRoles().subscribe({
      next: (data: ResourceUserModel[]) => {
        console.log("Status data", data);

        // Separate into users and non-users based on isUser flag
        this.users = data
          .filter(d => d.isUser)
          .map(d => ({
            userID: d.userID || 0,
            username: d.username || '',
            email: d.email || '',
            role: { roleID: d.roleID ?? 0, roleName: d.roleName ?? '' }
          }));

        console.log("USERS", this.users);

        this.resources = data
          .filter(d => !d.isUser)
          .map(d => ({
            resourceID: d.resourceID,
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
    this.selectedResource = resource;
    this.selectedRole = null;
    this.sending = false;
    this.sent = false;
    this.showInviteDialog = true;
  }

  sendInvitation() {
    if (!this.selectedRole) return;

    const model: InviteResourceRequestModel = {
      resourceID: this.selectedResource.resourceID,
      email: this.selectedResource.email,
      roleID: this.selectedRole.roleID
    };

    this.progressValue = 0;
    this.sending = true;
    this.sent = false;

    this.progressInterval = setInterval(() => {
      if (this.progressValue < 90) {
        this.progressValue += 7; // increase smoothly
      }
    }, 100);

    this.adminService.inviteResource(model).subscribe({
      next: (res) => {
        clearInterval(this.progressInterval);
        const finishInterval = setInterval(() => {
          if (this.progressValue < 100) {
            this.progressValue += 7;
          } else {
            clearInterval(finishInterval);
            this.sending = false;
            this.sent = true;

            this.loadResourcesWithStatusAndRoles();
            this.notificationService.show({
              content: "Invitation sent successfully",
              type: { style: "success", icon: true },
              hideAfter: 3000
            });
          }
        }, 100);
      },
      error: (err) => {
        clearInterval(this.progressInterval);
        this.sending = false;
        this.progressValue = 0;
        this.notificationService.show({
          content: "Failed to send invitation",
          type: { style: "error", icon: true },
          hideAfter: 3000
        });
      }
    });
  }

  changeRole(user: User, role: RoleModel) {
    this.openConfirmDialog(
      'Confirm Role Change',
      `Are you sure you want to change role of <b>${user.username}</b> to <b>${role.roleName}</b>?`,
      () => this.executeChangeRole(user, role) // call actual logic
    );
  }

  revokeUser(user: User) {
    this.openConfirmDialog(
      'Confirm Revoke',
      `Are you sure you want to revoke <b>${user.username}</b>?`,
      () => this.executeRevokeUser(user)
    );
  }

  private executeChangeRole(user: User, role: RoleModel) {
    const selectedRole = this.roles.find(r => r.roleID === role.roleID);
    if (selectedRole) {
      user.role = { roleID: selectedRole.roleID ?? 0, roleName: selectedRole.roleName };
    }

    const payload: UpdateUserRoleRequest = {
      userID: user.userID,
      roleID: role.roleID
    };

    console.log("PAYLOAD", payload);


    this.adminService.assignUserRole(payload).subscribe({
      next: () => {
        this.notificationService.show({
          content: "Role updated successfully",
          type: { style: "success", icon: true },
          hideAfter: 3000
        });

        this.loadResourcesWithStatusAndRoles();
      },
      error: (err) => console.error("Failed to update role:", err)
    });
  }


  private executeRevokeUser(user: User) {
    console.log('Revoking:', user);
    this.adminService.revokeUser(user.userID).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.show({
            content: res.message || "User revoked successfully!",
            type: { style: "success", icon: true },
            hideAfter: 5000,
            animation: { type: "slide", duration: 300 },
          });
          this.loadResourcesWithStatusAndRoles();
        } else {
          this.notificationService.show({
            content: res.message || "Failed to revoke user.",
            type: { style: "error", icon: true },
            hideAfter: 5000,
            animation: { type: "slide", duration: 300 },
          });
        }
      },
      error: (err) => {
        this.notificationService.show({
          content: "An error occurred while revoking the user.",
          type: { style: "error", icon: true },
          hideAfter: 5000,
          animation: { type: "slide", duration: 300 },
        });
        console.error('Revoke User API error:', err);
      }
    });
  }

  // Method to open confirmation dialog
  openConfirmDialog(title: string, message: string, action: () => void) {
    this.confirmDialogTitle = title;
    this.confirmDialogMessage = message;
    this.confirmAction = action;
    this.confirmDialogVisible = true;
  }

  // Execute confirm action
  confirm() {
    if (this.confirmAction) {
      this.confirmAction();
    }
    this.closeConfirmDialog();
  }

  closeConfirmDialog() {
    this.confirmDialogVisible = false;
    this.confirmAction = null;
  }
}
