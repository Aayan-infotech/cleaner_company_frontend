import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ItemInventoryService {

  http = inject(HttpClient);

  createItemService(formData: FormData):Observable<any> {
    return this.http.post<any>(`${apiUrls.itemInventoryApi}add-item`, formData);
  }

  getAllItemsService() {
    return this.http.get(`${apiUrls.itemInventoryApi}get-all-items`)
  }

  getAllItemsWithPaginatedService(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${apiUrls.itemInventoryApi}get-all-items-with-pagination`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  };  

  getItemByIdService(id: any) {
    return this.http.get(`${apiUrls.itemInventoryApi}get-item/${id}`);
  }

  updateItemService(formData: FormData, id: string): Observable<any> {
    return this.http.put<any>(`${apiUrls.itemInventoryApi}update-item/${id}`, formData);
  }

  deleteItemService(id: any) {
    return this.http.delete(`${apiUrls.itemInventoryApi}delete-item/${id}`);
  }

  // Manage Items for Warehouse and Van

  getAllItemsForWarehouseService() {
    return this.http.get(`${apiUrls.itemInventoryApi}get-all-warehouse-items`);
  }

  getAllItemsForVanService() {
    return this.http.get(`${apiUrls.itemInventoryApi}get-all-van-items`);
  }

  getAllItemsForVansService() {
    return this.http.get(`${apiUrls.itemInventoryApi}get-all-van-name`);
  }

  transferItemService(transferData: any) {
    return this.http.post<any>(`${apiUrls.itemInventoryApi}transfer-item`, transferData);
  }

  transferItemToVanService(transferItemData: any) {
    return this.http.post<any>(`${apiUrls.itemInventoryApi}transfer-item-to-van`, transferItemData);
  }

}
