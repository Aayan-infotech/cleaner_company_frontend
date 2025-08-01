import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProfilesService {

  constructor(private http: HttpClient) { }

  getAllProfileService(): Observable<any> {
    return this.http.get(`${apiUrls.profileManageApi}getAll`);
  };

  getProfileByIdService(id: any): Observable<any> {
    return this.http.get(`${apiUrls.profileManageApi}${id}`);
  };

  updateProfileService(data: any, id: number): Observable<any> {
    return this.http.put(`${apiUrls.profileManageApi}id`, data);
  };

  deleteProfileService(id: any): Observable<any> {
    return this.http.delete(`${apiUrls.profileManageApi}${id}`);
  };

}
