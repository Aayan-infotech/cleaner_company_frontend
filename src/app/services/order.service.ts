import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  http = inject(HttpClient);

  createItemOrderService(orderObj: any) {
    return this.http.post<any>(`${apiUrls.orderitemQuantity}order`, orderObj);
  }
}
