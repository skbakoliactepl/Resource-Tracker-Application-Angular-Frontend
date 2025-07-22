import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderServiceService } from '../loader-service.service';
import { Skill } from '../../models/skills/skill.model';
import { ActiveSkillViewModel } from '../../models/skills/active-skill.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private readonly baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }

    getAllSkills(): Observable<ApiResponse<Skill[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<Skill[]>>(`${this.baseUrl}/skills`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }

    getActiveSkills(): Observable<ApiResponse<ActiveSkillViewModel[]>> {
        this.loaderService.show();
        return this.http.get<ApiResponse<ActiveSkillViewModel[]>>(`${this.baseUrl}/skills/active`).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
