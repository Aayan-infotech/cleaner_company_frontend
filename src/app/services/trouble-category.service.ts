import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TroubleCategoryService {

  http = inject(HttpClient);

  // Category Services
  createCategoryService(categoryObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.troubleCategory}addTroubleCategory`, categoryObj);
  }

  getAllCategoryService(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.troubleCategory}get-all-trouble-categories`);
  }

  getCategoryByID(categoryId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.troubleCategory}${categoryId}`);
  }

  // updateCategoryService(categoryId: string, categoryObj: any): Observable<any> {
  //   return this.http.put<any>(`${apiUrls.troubleCategory}/${categoryId}`, categoryObj);
  // }

  deleteCategoryService(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrls.troubleCategory}/${categoryId}`);
  }

  // File Services
  addFilesToCategoryService(categoryId: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrls.troubleCategory}${categoryId}/add`, formData);
  }

  getAllFilesService(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.troubleCategory}/${categoryId}/allFiles`);
  }

  getFileByIdService(categoryId: string, fileId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.troubleCategory}/${categoryId}/get/${fileId}`);
  }

  updateFileService(categoryId: string, fileId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${apiUrls.troubleCategory}${categoryId}/update/${fileId}`, formData);
  }


  deleteFileService(categoryId: string, fileId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrls.troubleCategory}/${categoryId}/delete/${fileId}`);
  }
  
  // File Upload Service
  getImageService(filename: string): Observable<Blob> {
    return this.http.get(`${apiUrls.troubleCategory}/images/${filename}`, { responseType: 'blob' });
  }

  // Filter Services
  getImageFilesByCategoryService(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.troubleCategory}${categoryId}/filterImages`);
  }

  getVideoFilesByCategoryService(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.troubleCategory}${categoryId}/filterVideos`);
  }

  getPDFFilesByCategoryService(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.troubleCategory}${categoryId}/filterPdfs`);
  }

}


