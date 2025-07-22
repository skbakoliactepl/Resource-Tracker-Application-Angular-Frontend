import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderServiceService } from '../loader-service.service';
import { Manager } from '../../models/managers/manager.model';
import { ActiveManagerViewModel } from '../../models/managers/active-manager.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }

  getAllManagers(): Observable<ApiResponse<Manager[]>> {
    this.loaderService.show();
    return this.http.get<ApiResponse<Manager[]>>(`${this.baseUrl}/managers`).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  getActiveManagers(): Observable<ApiResponse<ActiveManagerViewModel[]>> {
    this.loaderService.show();
    return this.http.get<ApiResponse<ActiveManagerViewModel[]>>(`${this.baseUrl}/managers/active`).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
