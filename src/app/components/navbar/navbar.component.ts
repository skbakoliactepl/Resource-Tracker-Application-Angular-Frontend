import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { AuthService } from '../../services/auth/auth.service';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, HasRoleDirective, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  routePaths = RoutePaths;

  constructor(private authService: AuthService, private router: Router) { };

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // or ['/', 'login'] if using route paths
  }
}
