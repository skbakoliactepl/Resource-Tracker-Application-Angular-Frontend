import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule, CardModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { AuthService } from '../../services/auth/auth.service';
import { ResetPasswordRequest, User } from '../../models/auth/auth.models';
import { ResourceService } from '../../services/resource.service';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, ButtonModule, FormsModule, DialogModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  user!: User;
  showResetDialog = false;
  currentPassword = '';
  newPassword = '';

  constructor(private authService: AuthService, private resourceService: ResourceService, private notificationService: NotificationService) {
    this.authService.currentUser$.subscribe(u => this.user = u!);
  }

  ngOnInit() {
    // Subscribe to current user and fetch full details
    this.authService.currentUser$.subscribe(currentUser => {
      if (currentUser?.username) {
        console.log("email", currentUser?.email);

        this.authService.getUserByUsername(currentUser?.username).subscribe({
          next: (res) => {
            console.log("RES", res);

            this.user.userID = res.userID;
            // Fetch resource info using UserID
            this.resourceService.getByEmail(currentUser?.email)
              .pipe(finalize(() => console.log('Resource fetch complete')))
              .subscribe({
                next: (res) => {
                  this.user.designation = res.designationName;
                  this.user.resourceID = res.resourceID;
                  this.user.address = res.locationName;
                  this.user.projects = res.projects;
                },
                error: (err) => {
                  console.error('Error fetching resource info:', err);
                }
              });
          },
          error: (err) => {
            console.log("ERROR", err);
          }
        });
      }
    });
  }

  resetPassword() {
    this.showResetDialog = true;
  }

  cancelResetPassword() {
    this.showResetDialog = false;
    this.currentPassword = '';
    this.newPassword = '';
  }

  confirmResetPassword() {
    if (!this.user.userID || !this.newPassword) return;

    const request: ResetPasswordRequest = {
      userID: this.user.userID,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(request).subscribe({
      next: (res) => {
        this.notificationService.show({
          content: res.message || 'Password reset successfully',
          type: { style: 'success', icon: true },
          hideAfter: 5000,
          animation: { type: 'slide', duration: 400 },
        });
        this.cancelResetPassword();
      },
      error: (err) => {
        this.notificationService.show({
          content: err.error?.message || 'Error resetting password',
          type: { style: 'error', icon: true },
          hideAfter: 10000,
          animation: { type: 'slide', duration: 400 },
        });
      }
    });
  }
}
