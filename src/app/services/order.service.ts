import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  http = inject(HttpClient);

  createOrderItemService(itemId: string, requestedQuantity: number): Observable<any> {
    return this.http.post(`${apiUrls.orderitemQuantity}requested-order/${itemId}`, { requestedQuantity });
  }

}
