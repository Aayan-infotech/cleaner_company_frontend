import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root',
})
export class CrmService {
  constructor(private http: HttpClient) {}

  // Create a new CRM entry
  createCRM(data: any): Observable<any> {
    const formData = this.buildFormData(data);
    return this.http.post(`${apiUrls.crmMgmtApi}/add`, formData);
  }

  // Get all CRM entries
  getAllCRM(): Observable<any> {
    return this.http.get(`${apiUrls.crmMgmtApi}/get-all`);
  }

  // Get a CRM entry by ID
  getCRMById(id: string): Observable<any> {
    return this.http.get(`${apiUrls.crmMgmtApi}/get/${id}`);
  }

  // Update a CRM entry
  updateCRM(id: string, data: any): Observable<any> {
    const formData = this.buildFormData(data);
    return this.http.put(`${apiUrls.crmMgmtApi}/update/${id}`, formData);
  }

  // Delete a CRM entry
  deleteCRMById(id: string): Observable<any> {
    return this.http.delete(`${apiUrls.crmMgmtApi}/delete/${id}`);
  }

  // Utility to build FormData for file uploads
  private buildFormData(data: any): FormData {
    const formData = new FormData();

    // Primary fields
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('address', data.address);

    // Add phones array as JSON string
    if (data.phones?.length) {
      formData.append('phones', JSON.stringify(data.phones));
    }

    // Secondary fields
    formData.append('secondaryName', data.secondaryName);
    formData.append('secondaryEmail', data.secondaryEmail);
    formData.append('secondaryAddress', data.secondaryAddress);

    if (data.secondaryPhones?.length) {
      formData.append('secondaryPhones', JSON.stringify(data.secondaryPhones));
    }

    // Optional field
    if (data.paymentOptions) {
      formData.append('paymentOptions', data.paymentOptions);
    }

    // File uploads
    if (data.images?.length) {
      for (const image of data.images) {
        formData.append('images', image);
      }
    }

    return formData;
  }
}
