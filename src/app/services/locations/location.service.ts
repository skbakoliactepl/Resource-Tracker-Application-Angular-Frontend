import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderServiceService } from '../loader-service.service';
import { Location } from '../../models/locations/location.model';
import { ActiveLocationViewModel } from '../../models/locations/active-location.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private readonly baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }

    getAllLocations(): Observable<ApiResponse<Location[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<Location[]>>(`${this.baseUrl}/locations`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }

    getActiveLocations(): Observable<ApiResponse<ActiveLocationViewModel[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<ActiveLocationViewModel[]>>(`${this.baseUrl}/locations/active`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
