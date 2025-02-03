import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EmpCertificateService {

  http = inject(HttpClient);

  addEmpCertificateByEmpIdService(employeeId: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrls.empCertificatesApi}addCertificate/${employeeId}`, formData);
  }

  getAllEmpCertificatesByEmpIdService(employeeId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.empCertificatesApi}getAllCertificates/${employeeId}`);
  }

  getEmpCertificateByIdService(employeeId: string, certificateId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.empCertificatesApi}getByID/${employeeId}/${certificateId}`);
  }

  updateEmpCertificateByIdService(employeeId: string, certificateId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${apiUrls.empCertificatesApi}updateById/${employeeId}/${certificateId}`, formData);
  }

  deleteEmpCertificateByIdService(employeeId: string, certificateId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrls.empCertificatesApi}deleteCertificate/${employeeId}/${certificateId}`);
  }

}
