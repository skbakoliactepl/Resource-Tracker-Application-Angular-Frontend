import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, Observable } from 'rxjs';
import { LoaderServiceService } from './loader-service.service';
import { ResourceResponse, Resource, CreateResourceRequest, UpdateResourceRequest } from '../models';
import { __values } from 'tslib';
import { formateDateOnly } from '../shared/utils/date-utils';
import { environment } from '../../environments/environment';
import { FullResourceResponse } from '../models/resources/resource-full-detail-model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }
  private resources: Resource[] = [];
  isResourceSelected: boolean = false;
  private readonly URL: string = environment.apiBaseUrl;

  getAll(): Observable<Resource[]> {
    this.loaderService.show();
    return this.http.get<Resource[]>(this.URL + "/active").pipe(finalize(() => this.loaderService.hide()));
  }

  add(resource: CreateResourceRequest): Observable<CreateResourceRequest> {
    console.log("Add Employee Request initiated!", resource);
    this.loaderService.show();

    const payload: CreateResourceRequest = {
      fullName: resource.fullName,
      email: resource.email,
      doj: formateDateOnly(new Date(resource.doj))!,
      billable: resource.billable,
      remarks: resource.remarks || '',
      designationID: resource.designationID,
      locationID: resource.locationID
    };
    console.log("Payload", payload);

    return this.http.post<CreateResourceRequest>(this.URL, resource).pipe(finalize(() => this.loaderService.hide()));
  }

  update(id: number, resource: UpdateResourceRequest): Observable<void> {
    this.loaderService.show();
    const payload: UpdateResourceRequest = {
      ...resource
    };

    console.log("Payload ", payload);
    return this.http.put<void>(`${this.URL}/${id}`, payload).pipe(finalize(() => this.loaderService.hide()));
  }

  delete(id: number): Observable<void> {
    this.loaderService.show();
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(finalize(() => this.loaderService.hide()));
  }

  deleteBulk(resourcIds: number[]): Observable<void> {
    this.loaderService.show();
    return this.http.post<void>(`${this.URL}/delete-bulk`, resourcIds)
      .pipe(finalize(() => this.loaderService.hide()));
  }

  getById(id: number): Observable<ResourceResponse> {
    this.loaderService.show();
    return this.http.get<ResourceResponse>(`${this.URL}/${id}`).pipe(
      map((res: ResourceResponse) => {
        return {
          ...res,
          doj: new Date(res.doj)
        }
      }),
      finalize(() => {
        this.loaderService.hide()
      })
    );
  }

  getByEmail(email: string): Observable<ResourceResponse> {
    this.loaderService.show();
    const emailEncoded = encodeURIComponent(email); // encode @ and other special chars
    return this.http.get<ResourceResponse>(`${this.URL}/by-email/${emailEncoded}`).pipe(
      map(res => ({ ...res, doj: new Date(res.doj) })),
      finalize(() => this.loaderService.hide())
    );
  }

  getFullDetailsById(id: number): Observable<FullResourceResponse> {
    this.loaderService.show();
    return this.http.get<{ data: FullResourceResponse }>(`${this.URL}/full/${id}`).pipe(
      map((res) => ({
        ...res.data,
        doj: new Date(res.data.doj)
      })),
      finalize(() => this.loaderService.hide())
    );
  }

  bulkUpdate(payload: any[]): Observable<any> {
    return this.http.put(`${this.URL}/bulk-update`, payload);
  }
}
