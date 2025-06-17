import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})

export class TemplateService {

  constructor(private http: HttpClient) { }

  // Get All Template
  getAllTemplateService(): Observable<any> {
    return this.http.get(`${apiUrls.templateApis}getAllTemplates`);
  }
}
