import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VanService {

  http = inject(HttpClient);

  // create van serice
  createVanService(van: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.inventoryVanApi}addNewVan`, van);
  }

  getAllVans(): Observable<any> {
    return this.http.get<any>(`${apiUrls.inventoryVanApi}`);
  }

  getVanById(vanId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.inventoryVanApi}${vanId}`);
  }

}
