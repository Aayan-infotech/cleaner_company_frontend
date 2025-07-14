import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Template2Service {

  http = inject(HttpClient);

  createTemplateService(payload: any): Observable<any> {
    return this.http.post(`${apiUrls.template2Apis}add`, payload);
  };

  getAllTemplatesService():Observable<any> {
    return this.http.get(`${apiUrls.template2Apis}`);
  };

  getTemplateService(id: any): Observable<any> {
    return this.http.get(`${apiUrls.template2Apis}${id}`);
  };

  deleteTemplateService(id: any): Observable<any> {
    return this.http.delete(`${apiUrls.template2Apis}${id}`);
  }   

  
}
