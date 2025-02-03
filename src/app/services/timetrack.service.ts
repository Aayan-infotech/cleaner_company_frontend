import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetrackService {

  private baseUrl = 'http://44.196.64.110:5966/api/timeTrack'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getTimeLogsByEmployeeId(employeeId: string, page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/time-logs/${employeeId}`, { params });
  }
}
