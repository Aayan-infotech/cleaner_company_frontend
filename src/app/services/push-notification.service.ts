import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private apiUrl = 'http://98.82.228.18:5966/api';
  constructor(private http: HttpClient) { }

  getTokenByUserId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getToken/${id}`);
  }

  sendNotification(data: { employeeId: string; token: string; title: string; body: string }) {
    const url = 'http://98.82.228.18:5966/api/notification/send-notification'; 
    return this.http.post<{ message: string }>(url, data);
  }
  
  getNotifications(employeeId: string): Observable<any> {
    return this.http.get(`http://98.82.228.18:5966/api/notification/get-notification/${employeeId}`);
  }

}
