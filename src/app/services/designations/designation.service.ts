import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderServiceService } from '../loader-service.service';
import { Designation } from '../../models/designations/designation.model';
import { ActiveDesignationViewModel } from '../../models/designations/active-designation.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class DesignationService {
    private readonly baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }

    getAllDesignations(): Observable<ApiResponse<Designation[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<Designation[]>>(`${this.baseUrl}/designations`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }

    getActiveDesignations(): Observable<ApiResponse<ActiveDesignationViewModel[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<ActiveDesignationViewModel[]>>(`${this.baseUrl}/designations/active`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
