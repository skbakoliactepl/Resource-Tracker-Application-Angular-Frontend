// location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface LocationModel {
  locationID: number;
  locationName: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiUrl = `${environment.apiBaseUrl}/locations`;

  constructor(private http: HttpClient) { }

  getLocations(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(`${this.apiUrl}/get-all`);
  }

  addLocation(location: Partial<LocationModel>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, location);
  }

  updateLocation(location: LocationModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${location.locationID}`, location);
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
