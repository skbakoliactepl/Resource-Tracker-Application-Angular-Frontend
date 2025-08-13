import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ResourceUserModel } from '../../models/admin/admin.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly adminUrl = environment.apiAdminUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  getAllResourcesWithUserStatusAndRoles(): Observable<ResourceUserModel[]> {
    return this.http.get<ResourceUserModel[]>(
      `${this.adminUrl}/resources-with-user-status`,
      { headers: this.getAuthHeaders() }
    );
  }
}
