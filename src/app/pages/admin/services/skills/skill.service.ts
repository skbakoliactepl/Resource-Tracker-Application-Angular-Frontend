// skill.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface SkillModel {
  skillID: number;
  skillName: string;
}

@Injectable({ providedIn: 'root' })
export class SkillService {
  private apiUrl = `${environment.apiBaseUrl}/skills`;

  constructor(private http: HttpClient) { }

  getSkills(): Observable<SkillModel[]> {
    return this.http.get<SkillModel[]>(`${this.apiUrl}/get-all`);
  }

  addSkill(skill: Partial<SkillModel>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, skill);
  }

  updateSkill(skill: SkillModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${skill.skillID}`, skill);
  }

  deleteSkill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
