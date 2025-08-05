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
    return this.http.post(`${apiUrls.marketingCategoriesApi}create-marketing-category`, data);
  }

  // Get All Categories With Pagination
  getAllCategoriesService(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${apiUrls.marketingCategoriesApi}get-all-marketing-categories`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  // Get All Categories Without Pagination
  getAllCategoryService(): Observable <any> {
    return this.http.get(`${apiUrls.marketingCategoriesApi}get-all-marketingCategories`);
  }

  // Get Category By ID
  getCategoryByIdService(id: any): Observable<any> {
    return this.http.get(`${apiUrls.marketingCategoriesApi}get-marketing-category/${id}`);
  }

  // Update category Details By Id
  updateCategoryByIdService(id: any, data: any): Observable <any> {
    return this.http.put(`${apiUrls.marketingCategoriesApi}update-marketing-category/${id}`, data);
  }

  // Delete Category By Id
  deleteCategoryById(id: any): Observable<any> {
    return this.http.delete(`${apiUrls.marketingCategoriesApi}delete-marketing-category/${id}`);
  }

}
