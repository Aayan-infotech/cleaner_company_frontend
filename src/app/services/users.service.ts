import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  constructor(private http: HttpClient) { }

  createUserService(formData: FormData):Observable<any>{
    return this.http.post<any>(`${apiUrls.userServiceApi}register`,formData);
  }
  
  getAllUsersService(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.userServiceApi}`)
  }
  // getUserService() {
  //   return this.http.get(`${apiUrls.userServiceApi}id`)
  // }
  updateUserService(userId: any, formData: FormData): Observable<any> {
    return this.http.put(`http://98.85.246.54:5966/api/user/${userId}`,formData)
  }
  deleteUserService(id: any): Observable<any> {
    return this.http.delete(`http://98.85.246.54:5966/api/user/${id}`)
  }
   
  getUserByIdService(id:any): Observable<any>{
    return this.http.get(`http://98.85.246.54:5966/api/user/${id}`)
  }

}
