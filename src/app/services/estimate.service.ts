import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})

export class EstimateService {

  constructor(private http: HttpClient) { }

  // Get All JobIDs
  getAllJobsService(): Observable <any> {
    return this.http.get<any>(`${apiUrls.JobsApi}jobId`)
  }

  // Get All Rooms
  getAllRoomsService(): Observable <any> {
    return this.http.get<any>(`${apiUrls.roomsApi}rooms`)
  }

  // Get All Services
  getAllServicesService(): Observable<any> {
    return this.http.get<any>(`${apiUrls.servicesApi}getAll`)
  }
  
  submitEstimate(payload: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.estimateAPI}create`, payload);
  }

  getAllEstimates(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.estimateAPI}getAll`)
  }

  getEstimateByIdService(id: any): Observable <any> {
    return this.http.get<any>(`${apiUrls.estimateAPI}getById/${id}`);
  }

  deleteEstimateService(id: any): Observable<any> {
    return this.http.delete(`${apiUrls.estimateAPI}delete/${id}`);
  };

}
