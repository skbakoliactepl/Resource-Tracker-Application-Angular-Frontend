import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // if (token) {
    //   // Clone the request to add the new header
    //   const authReq = req.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });
    //   // Pass on the cloned request instead of the original request.
    //   return next.handle(authReq);
    // }
    // If no token, just pass the request as is

    if (token) {
      // ✅ check expiry before request
      if (this.isTokenExpired(token)) {
        this.authService.logout(); // clear token/session
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token expired'));
      }

      // clone request with Authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
          // ✅ handle 401 Unauthorized (token expired on backend)
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => err);
        })
      );
    }
    return next.handle(req);
  }

  // helper: decode and check expiry
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // exp is in seconds
      return Date.now() > expiry;
    } catch (e) {
      return true; // if invalid token, treat as expired
    }
  }
}
