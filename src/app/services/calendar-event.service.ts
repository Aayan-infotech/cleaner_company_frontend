import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  private apiUrl = 'http://44.196.64.110:5966/api/users';
  
  constructor(private http: HttpClient) {}

  createEventService(event: any) {
    return this.http.post<any>(`${apiUrls.eventsApi}add`, event);
  };

  getAllEventsService() {
    return this.http.get<any[]>(`${apiUrls.eventsApi}`);
  };

  getEventService(id: any) {
    return this.http.get<any>(`${apiUrls.eventsApi}/${id}`);
  };

  updateEventService(data: any, id: any) {
    return this.http.put<any>(`${apiUrls.eventsApi}/${id}`, data);
  };

  deleteEventService(id: any) {
    return this.http.delete<any>(`${apiUrls.eventsApi}/${id}`);
  };

  getAllUsersService(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  };
}