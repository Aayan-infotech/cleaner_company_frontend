import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private baseUrl = 'http://18.209.91.97:5966/api/manage-crm';

  constructor(private http: HttpClient) {}

  // Create a new CRM entry
  createCRM(data: any): Observable<any> {
    const formData = this.buildFormData(data);
    return this.http.post(`${this.baseUrl}/add`, formData);
  }

  // Get all CRM entries
  getAllCRM(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all`);
  }

  // Get a CRM entry by ID
  getCRMById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${id}`);
  }

  // Update a CRM entry
  updateCRM(id: string, data: any): Observable<any> {
    const formData = this.buildFormData(data);
    return this.http.put(`${this.baseUrl}/update/${id}`, formData);
  }

  // Delete a CRM entry
  deleteCRMById(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // Utility to build FormData for file uploads
  private buildFormData(data: any): FormData {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('address', data.address);

    // Add phones array as JSON string
    if (data.phones?.length) {
      formData.append('phones', JSON.stringify(data.phones));
    }

    // Add images
    if (data.images?.length) {
      for (const image of data.images) {
        formData.append('images', image);
      }
    }

    return formData;
  }
}
