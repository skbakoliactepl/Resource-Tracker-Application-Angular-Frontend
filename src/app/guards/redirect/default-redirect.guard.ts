import { Injectable } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RoutePaths } from '../../config/route-paths';

@Injectable({
  providedIn: 'root'
})
export class DefaultRedirectGuard {

  constructor(private authService: AuthService, private router: Router) { }

  canMatch(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log("INSIDE LOGGED IN");

      this.router.navigate([`/${RoutePaths.appBase}/${RoutePaths.resourceGrid}`]);
      return false; // Stop further activation since we're redirecting
    } else {
      this.router.navigate([`/${RoutePaths.login}`]);
      return false;
    }
  }
}
