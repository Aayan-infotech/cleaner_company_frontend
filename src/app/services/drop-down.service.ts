import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DropDownService {


  constructor(private http: HttpClient, private router: Router) { }
 

  getAllDropDownService(){
    return this.http.get(`http://3.223.253.106:5966/api/dropdown/getAll`)
  }
}
