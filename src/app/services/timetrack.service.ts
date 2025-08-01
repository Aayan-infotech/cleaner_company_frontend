import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TimetrackService {
  
  constructor(private http: HttpClient) {}

  getTimeLogsByEmployeeId(employeeId: string, page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<any>(`${apiUrls.timetrackerApi}time-logs/${employeeId}`, { params });
  }

  applyLeave(employeeId: string, startDate: string, endDate: string): Observable<any> {
    const body = { employeeId, startDate, endDate };
    return this.http.post(`${apiUrls.leaveApi}apply`, body);
  }

}
