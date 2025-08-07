// project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ProjectModel {
  projectID: number;
  projectName: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = `${environment.apiBaseUrl}/projects`;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.apiUrl}/get-all`);
  }

  addProject(project: Partial<ProjectModel>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, project);
  }

  updateProject(project: ProjectModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${project.projectID}`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
