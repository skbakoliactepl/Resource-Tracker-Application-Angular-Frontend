import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RoutePaths } from '../../config/route-paths';
import { PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css'
})
export class LoginLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      console.log("INSIDE LOG LAYOUT");
      this.router.navigate([`/${RoutePaths.appBase}/${RoutePaths.resourceGrid}`]);
    } else {
      this.router.navigate([`${RoutePaths.loginLayout}/${RoutePaths.login}`]);
    }
  }
}
