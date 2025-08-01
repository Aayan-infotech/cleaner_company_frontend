import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EmpMgmtService {

  http = inject(HttpClient);

  createEmpMgmtService(formData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrls.empMgmtApi}addEmployee`, formData);
  }

  // Get all users
  getAllEmpMgmtsService1(page: number, limit: number, status?: string, search?: string): Observable<any> {
    let params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;

    return this.http.get<any[]>(`${apiUrls.empMgmtApi}getAllEmployees`, { params });
  }

  getAllEmpMgmtsService(page: number, limit: number, status?: string, search?: string ): Observable<{ success: boolean; status: number; message: string; data: any[]; pagination: { total: number; page: number; limit: number; totalPages: number; }; }> {
    let params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;

    return this.http.get<{
      success: boolean;
      status: number;
      message: string;
      data: any[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`${apiUrls.empMgmtApi}getAllEmployees`, { params });
  }



  // Get a user by ID
  getEmpMgmtByIdService(id: any): Observable<any> {
    return this.http.get<any>(`${apiUrls.empMgmtApi}getEmployee/${id}`);
  }

  // Update a user by ID
  updateEmpMgmtService(empId: any, formData: FormData): Observable<any> {
    return this.http.put<any>(`${apiUrls.empMgmtApi}updateEmployee/${empId}`, formData);
  }

  // Delete a user by ID
  deleteEmpMgmtByIdService(id: any): Observable<any> {
    return this.http.delete<any>(`${apiUrls.empMgmtApi}deleteEmployee/${id}`);
  }


  toggleEmpStatus(empId: string): Observable<any> {
    return this.http.put<any>(`${apiUrls.empMgmtApi}updateEmployeeStatus/${empId}`, {});
  }



}
