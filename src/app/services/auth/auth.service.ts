import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoginRequest, LoginResponse, ResetPasswordRequest, User } from '../../models/auth/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = environment.apiAuthUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, data).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        // Decode token or get user info from response.role
        this.currentUserSubject.next({
          username: data.usernameOrEmail,
          email: '', // optional, or decode from token if you want
          role: response.roleName
        });
        console.log("CURRENT USER", response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      // For now, just mark user as logged in
      this.currentUserSubject.next({
        username: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
        email: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
        role: decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || ''
      });
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      console.log("DECODED Payload", JSON.parse(atob(payload)));
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, request).pipe(
      tap(response => {
        console.log('Password reset response:', response);
      }),
      catchError((error: any) => {
        console.error('Error resetting password:', error);
        return throwError(() => error);
      })
    );
  }


  getUserByUsername(username: string): Observable<any> {
    return this.http.get<{ Success: boolean; data: any }>(`${this.authUrl}/get-user-by-username/${username}`)
      .pipe(
        tap(response => {
          console.log("USER DETAILS", response?.data);
        }),
        map(response => response.data)
      );
  }
}
