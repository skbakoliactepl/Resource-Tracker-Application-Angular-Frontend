import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, Observable } from 'rxjs';
import { LoaderServiceService } from './loader-service.service';
import { ResourceResponse, Resource, CreateResourceRequest, UpdateResourceRequest } from '../models';
import { __values } from 'tslib';
import { formateDateOnly } from '../shared/utils/date-utils';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }
  private resources: Resource[] = [];


  isResourceSelected: boolean = false;
  private readonly URL: string = "http://localhost:5252/api/employee";

  getAll(): Observable<Resource[]> {
    this.loaderService.show();
    return this.http.get<Resource[]>(this.URL).pipe(finalize(() => this.loaderService.hide()));
  }

  add(resource: Resource): Observable<Resource> {
    console.log("Add Employee Request initiated!");
    this.loaderService.show();

    // Conver dropdown object to boolean
    if (typeof resource.isBillable === 'object' && resource.isBillable != null) {
      resource.isBillable = (resource.isBillable as { value: boolean }).value;
    }

    // Convert skills to array of skills
    if (typeof resource.skills === 'string') {
      resource.skills = (resource.skills as string)
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => !!skill);
    }

    const payload: CreateResourceRequest = {
      ...resource,
      dateOfJoining: formateDateOnly(resource.dateOfJoining)!
    };

    return this.http.post<Resource>(this.URL, payload).pipe(finalize(() => this.loaderService.hide()));
  }

  update(id: string, resource: Resource): Observable<void> {
    this.loaderService.show();

    // Conver dropdown object to boolean
    if (typeof resource.isBillable === 'object' && resource.isBillable != null) {
      resource.isBillable = (resource.isBillable as { value: boolean }).value;
    }

    // Convert skills to array of skills
    if (typeof resource.skills === 'string') {
      resource.skills = (resource.skills as string)
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => !!skill);
    }

    // Convert the dateOfJoining to SQL string format (yyyy-mm-dd)
    // const formattedDate = resource.dateOfJoining instanceof Date
    //   ? formateDateOnly(resource.dateOfJoining) : null;

    const payload: UpdateResourceRequest = {
      empId: resource.empId!!,
      ...resource,
      dateOfJoining: formateDateOnly(resource.dateOfJoining)!
    };

    console.log("Payload ", payload);
    return this.http.put<void>(`${this.URL}/${id}`, payload).pipe(finalize(() => this.loaderService.hide()));
  }

  delete(id: string): Observable<void> {
    this.loaderService.show();
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(finalize(() => this.loaderService.hide()));
  }

  getById(id: string): Observable<ResourceResponse> {
    this.loaderService.show();

    return this.http.get<ResourceResponse>(`${this.URL}/${id}`).pipe(
      map((res: ResourceResponse) => {
        return {
          ...res,
          dateOfJoining: new Date(res.dateOfJoining)
        }
      }),
      finalize(() => {
        this.loaderService.hide()
      })
    );
  }
}
