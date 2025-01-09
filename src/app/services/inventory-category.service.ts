import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InventoryCategoryService {

  http = inject(HttpClient);

  // Create a new inventory category
  createInventoryCategoryService(categoryObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.inventoryCategoryApi}addInventoryCategory`, categoryObj);
  }

  // Get all inventory categories
  getAllInventoryCategoryService(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.inventoryCategoryApi}`);
  }

  // Get an inventory category by ID
  getInventoryCategoryByIdService(categoryId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.inventoryCategoryApi}/${categoryId}`);
  }

  // Update an inventory category by ID
  updateInventoryCategoryService(categoryId: string, categoryObj: any): Observable<any> {
    return this.http.put<any>(`${apiUrls.inventoryCategoryApi}/${categoryId}`, categoryObj);
  }

  // Delete an inventory category by ID
  deleteInventoryCategoryService(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrls.inventoryCategoryApi}/${categoryId}`);
  }

}
