// designation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface DesignationModel {
  designationID: number;
  designationName: string;
}

@Injectable({ providedIn: 'root' })
export class DesignationService {
  private apiUrl = `${environment.apiBaseUrl}/designations`;

  constructor(private http: HttpClient) { }

  getDesignations(): Observable<DesignationModel[]> {
    return this.http.get<DesignationModel[]>(`${this.apiUrl}/get-all`);
  }

  addDesignation(designation: Partial<DesignationModel>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, designation);
  }

  updateDesignation(designation: DesignationModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${designation.designationID}`, designation);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
