import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Template2Service {

  http = inject(HttpClient);

  createTemplateService(formData: FormData): Observable<any> {
    return this.http.post(`${apiUrls.template2Apis}add-template`, formData);
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

  shareTemplateClitesService(templateId: string, clientIds: string[]): Observable<any> {
    return this.http.post(`${apiUrls.template2Apis}${templateId}/share-to-clients`, { clientIds: clientIds } );
  }

  shareTemplateGroupsService(templateId: string, groupIds: string[]): Observable<any> {
    return this.http.post(`${apiUrls.template2Apis}${templateId}/share-to-groups`, { groupIds: groupIds } );
  }
  


  
}
