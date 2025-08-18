import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { Service } from '../models/service';
import { DryCleaning } from '../models/dry-cleaning';
import { HardSurface } from '../models/hard-surface';
import { Method } from '../models/method';
import { ItemClean } from '../models/item-clean';
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://localhost:5966/api2';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials`);
  }
  
  getItemCleans(): Observable<ItemClean[]> {
    return this.http.get<ItemClean[]>(`${this.apiUrl}/itemCleans`);
  }

  getDryCleanings(): Observable<DryCleaning[]> {
    return this.http.get<DryCleaning[]>(`${this.apiUrl}/dryCleanings`);
  }

  getHardSurfaces(): Observable<HardSurface[]> {
    return this.http.get<HardSurface[]>(`${this.apiUrl}/hardSurfaces`);
  }

  getMethods(): Observable<Method[]> {
    return this.http.get<Method[]>(`${this.apiUrl}/methods`);
  }
}
