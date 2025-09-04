import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})

export class ItemInventoryTransferService {

  constructor(private http: HttpClient) { }

   // Transfer item from warehouse to van
   transferToVanService(payload: { itemId: string; vanId: string; quantity: number }): Observable<any> {
    return this.http.post(`${apiUrls.itemInventoryTransferApi}transfer-item-to-van`, payload);
  }

  // Get all transfers (with van + item populated, sorted descending)
  getAllTransfersService(): Observable<any> {
    return this.http.get(`${apiUrls.itemInventoryTransferApi}get-all-transfered-items`);
  }

  // Get transfer details by ID
  getTransferByIdService(id: string): Observable<any> {
    return this.http.get(`${apiUrls.itemInventoryTransferApi}get-transfer/${id}`);
  }

  // Delete transfer by ID
  deleteTransferByIdService(id: string): Observable<any> {
    return this.http.delete(`${apiUrls.itemInventoryTransferApi}delete-transfer/${id}`);
  }
}
