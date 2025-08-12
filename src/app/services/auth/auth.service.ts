import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { LoginRequest, LoginResponse, User } from '../../models/auth/auth.models';
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
          role: response.role
        });
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
      // Optionally decode token to get user info and role
      // For now, just mark user as logged in
      this.currentUserSubject.next({
        username: '',
        email: '',
        role: '' // decode if you want
      });
    }
  }
}
