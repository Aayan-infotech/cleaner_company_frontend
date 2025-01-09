import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoryItemService {

  http = inject(HttpClient);

  // Create category item
  createItemService(categoryId: string, formData: FormData): Observable<any> {
    return this.http.post(`${apiUrls.categoryItemApi}${categoryId}/item`, formData);
  }

  // Get all category items
  getAllItemsService(categoryId: string): Observable<any> {
    return this.http.get(`${apiUrls.categoryItemApi}${categoryId}/getAll`);
  }

  // Get category item by ID
  getItemByIdService(categoryId: string, itemId: string): Observable<any> {
    return this.http.get(`${apiUrls.categoryItemApi}${categoryId}/get/${itemId}`);
  }

  // Update category item by ID
  updateItemByIdService(categoryId: string, itemId: string, formData: FormData): Observable<any> {
    return this.http.put(`${apiUrls.categoryItemApi}${categoryId}/update/${itemId}`, formData);
  }

  // Delete category item by ID
  deleteItemByIdService(categoryId: string, itemId: string): Observable<any> {
    return this.http.delete(`${apiUrls.categoryItemApi}${categoryId}/delete/${itemId}`);
  }

}
