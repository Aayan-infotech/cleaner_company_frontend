import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UploadfilesService {

  http = inject(HttpClient);

   //create service
   createUploadFilesService(formData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrls.uploadFilesApi}add`, formData);
  };

  // Fetch all Upload Files service
  getAllUploadFilesService(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.uploadFilesApi}`);
  }

  // Fetch Upload Files by ID service
  getUploadFilesByIdService(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.uploadFilesApi}/${id}`);
  }

  // Update Upload Files service
  updateUploadFilesService(troubleId: any, formData: FormData): Observable<any> {
    return this.http.put<any[]>(`${apiUrls.uploadFilesApi}/${troubleId}`, formData);
  }

  // Delete Upload Files service
  deleteUploadFilesService(id: any): Observable<any> {
    return this.http.delete(`${apiUrls.uploadFilesApi}/${id}`);
  }

}
