import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderServiceService } from '../loader-service.service';
import { Project } from '../../models/projects/project.model';
import { ActiveProjectViewModel } from '../../models/projects/active-project.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }

    getAllProjects(): Observable<ApiResponse<Project[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<Project[]>>(`${this.baseUrl}/projects`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }

    getActiveProjects(): Observable<ApiResponse<ActiveProjectViewModel[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<ActiveProjectViewModel[]>>(`${this.baseUrl}/projects/active`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
