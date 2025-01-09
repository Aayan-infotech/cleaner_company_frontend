import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';
@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  constructor(private http: HttpClient) { }
  submitEstimate(estimate: any): Observable<any> {

    return this.http.post<any>(`${apiUrls.estimateAPI}submit-estimate`, estimate);
  }

  getAllEstimates(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.estimateAPI}getAll`)
  }

  deleteEstimateService(id: any): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/estimates/${id}`);
  };

}
