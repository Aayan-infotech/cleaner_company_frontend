import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemInventoryService {

  http = inject(HttpClient);

  createItemService(itemObj: any) {
    return this.http.post<any>(`${apiUrls.itemInventoryApi}addItem`, itemObj);
  }

  getAllItemsService() {
    return this.http.get(`${apiUrls.itemInventoryApi}getAllItems`)
  }

  // getItemByIdService(id: any) {
  //   return this.http.get(`http://localhost:3000/api/item/get/${id}`)
  // }

  // updateItemService(data: any, id: number) {
  //   return this.http.put(`http://localhost:3000/api/item/update/${id}`, data)
  // }

  // deleteItemService(id: any) {
  //   return this.http.delete(`http://localhost:3000/api/item/delete/${id}`)
  // } 

  getItemByIdService(id: any) {
    return this.http.get(`${apiUrls.itemInventoryApi}get/${id}`);
  }

  updateItemService(data: any, id: string) {
    return this.http.put(`${apiUrls.itemInventoryApi}update/${id}`, data);
  }

  deleteItemService(id: any) {
    return this.http.delete(`${apiUrls.itemInventoryApi}delete/${id}`);
  }


  // New method to get all items for warehouse
  getAllItemsForWarehouseService() {
    return this.http.get(`${apiUrls.itemInventoryApi}allWarehouseItems`);
  }

  // New method to get all items for van
  getAllItemsForVanService() {
    return this.http.get(`${apiUrls.itemInventoryApi}allVanItems`);
  }

  getAllItemsForVansService() {
    return this.http.get(`${apiUrls.itemInventoryApi}allVanName`);
  }

  // New method to transfer items
  transferItemService(transferData: any) {
    return this.http.post<any>(`${apiUrls.itemInventoryApi}transferItem`, transferData);
  }

  // New method to transfer items from one van to another
  transferItemToVanService(transferItemData: any) {
    return this.http.post<any>(`${apiUrls.itemInventoryApi}transferItemToVan`, transferItemData);
  }

}
