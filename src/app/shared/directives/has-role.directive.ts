import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private subscription: Subscription;
  private allowedRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.updateView(user?.role);
    });
  }

  @Input()
  set appHasRole(roles: string[] | string) {
    // Normalize to array
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.authService.currentUser$.subscribe(user => {
      this.updateView(user?.role);
    });
  }

  private updateView(userRole?: string) {
    this.viewContainer.clear();
    if (userRole && this.allowedRoles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
