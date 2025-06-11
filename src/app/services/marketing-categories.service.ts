import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class MarketingCategoriesService {

  constructor(private http: HttpClient) {}

  // Create new category
  createCategoryService(data: any): Observable<any> {
    return this.http.post(`${apiUrls.marketingCategoriesApi}createCategory`, data);
  }

  // Get All Categories with Pagination
  getAllCategoriesService(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${apiUrls.marketingCategoriesApi}getAllCategories`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  // Get Category By ID
  getCategoryByIdService(id: any): Observable<any> {
    return this.http.get(`${apiUrls.marketingCategoriesApi}getCategoryById/${id}`);
  }

  // Update category Details By Id
  updateCategoryByIdService(id: any, data: any): Observable <any> {
    return this.http.put(`${apiUrls.marketingCategoriesApi}updateCategory/${id}`, data);
  }

  // Delete Category By Id
  deleteCategoryById(id: any): Observable<any> {
    return this.http.delete(`${apiUrls.marketingCategoriesApi}deleteCategory/${id}`);
  }

}
