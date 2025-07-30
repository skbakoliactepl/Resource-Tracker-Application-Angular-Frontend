import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderServiceService } from '../loader-service.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-responses/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private loaderService: LoaderServiceService) { }

  uploadResourceFile(file: File): Observable<HttpEvent<ApiResponse<any>>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/import`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    this.loaderService.show();

    return this.http.request<ApiResponse<any>>(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
