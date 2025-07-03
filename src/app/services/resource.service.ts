import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, Observable } from 'rxjs';
import { LoaderServiceService } from './loader-service.service';
import { ResourceResponse, Resource, CreateResourceRequest } from '../models';

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

    // Convert dropdown object to boolean
    resource.isBillable = resource.isBillable ?? null;

    // Convert skills to array of skills
    if (typeof resource.skills === 'string') {
      resource.skills = (resource.skills as string)
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => !!skill);
    }

    // Convert the dateOfJoining to SQL string format (yyyy-mm-dd)
    const formattedDate = resource.dateOfJoining instanceof Date
      ? resource.dateOfJoining.toISOString() : null;

    const payload: CreateResourceRequest = {
      ...resource,
      dateOfJoining: formattedDate!!
    };

    return this.http.post<Resource>(this.URL, payload).pipe(finalize(() => this.loaderService.hide()));
  }

  update(id: string, resource: Resource): Observable<void> {
    this.loaderService.show();
    return this.http.put<void>(`${this.URL}/${id}`, resource).pipe(finalize(() => this.loaderService.hide()));
  }

  delete(id: string): Observable<void> {
    this.loaderService.show();
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(finalize(() => this.loaderService.hide()));
  }

  getById(id: string): Observable<Resource> {
    this.loaderService.show();
    // return this.http.get<ResourceResponse>(`${this.URL}/${id}`).pipe(finalize(() => {
    //   this.loaderService.hide()
    // }));

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
