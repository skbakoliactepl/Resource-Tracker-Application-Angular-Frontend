// manager.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ManagerModel {
  managerID: number;
  managerName: string;
}

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private apiUrl = `${environment.apiBaseUrl}/managers`;

  constructor(private http: HttpClient) { }

  getManagers(): Observable<ManagerModel[]> {
    return this.http.get<ManagerModel[]>(`${this.apiUrl}/get-all`);
  }

  addManager(manager: Partial<ManagerModel>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, manager);
  }

  updateManager(manager: ManagerModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${manager.managerID}`, manager);
  }

  deleteManager(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
