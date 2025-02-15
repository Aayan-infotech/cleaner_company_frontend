import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageuploadService {

  constructor(private http: HttpClient) { }

  uploadProduct(formData: FormData): Observable<any> {
    return this.http.post<any>('http://44.196.64.110:5966/api/upload', formData);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>('http://44.196.64.110:5966/api/products');
  }
}
