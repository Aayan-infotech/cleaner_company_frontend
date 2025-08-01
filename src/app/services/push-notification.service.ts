import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient) { }

  getTokenByUserId(id: string): Observable<any> {
    return this.http.get(`${apiUrls.notificationApi}/getToken/${id}`);
  }

  sendNotification(data: { employeeId: string; token: string; title: string; body: string }) {
    const url = `${apiUrls.notificationApi}send-notification`; 
    return this.http.post<{ message: string }>(url, data);
  }
  
  getNotifications(employeeId: string): Observable<any> {
    return this.http.get(`${apiUrls.notificationApi}get-notification/${employeeId}`);
  }

}
