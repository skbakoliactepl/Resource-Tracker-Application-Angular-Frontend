import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InviteResourceRequestModel, ResourceUserModel, RoleModel, UpdateUserRoleRequest } from '../../models/admin/admin.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly adminUrl = environment.apiAdminUrl;
  private readonly authUrl = environment.apiAuthUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  };

  getAllResourcesWithUserStatusAndRoles(): Observable<ResourceUserModel[]> {
    return this.http.get<ResourceUserModel[]>(
      `${this.adminUrl}/resources-with-user-status`,
      { headers: this.getAuthHeaders() }
    );
  };

  getAllRoles(): Observable<ApiResponse<RoleModel[]>> {
    return this.http.get<ApiResponse<RoleModel[]>>(
      `${this.authUrl}/roles`,
      { headers: this.getAuthHeaders() }
    );
  };

  assignUserRole(request: UpdateUserRoleRequest): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/update-role`,
      request,
      { headers: this.getAuthHeaders() }
    );
  };

  inviteResource(model: InviteResourceRequestModel): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/invite`,
      model,
      { headers: this.getAuthHeaders() }
    );
  };

  revokeUser(userId: number): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/revoke/${userId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  };
}
