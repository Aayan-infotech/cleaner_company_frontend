import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
@Injectable({
  providedIn: 'root'
})
export class ContentService {

  http = inject(HttpClient);

  createVersionService(verObj:any){
    return this.http.post<any>(`${apiUrls.contentVersion}addVersion`,verObj);
  }


   getAllVersionsService(){
    return this.http.get(`${apiUrls.contentVersion}getVersions`)
   }

  //Library

  createLibraryService(libObj:any){
    return this.http.post<any>(`${apiUrls.contentLibrary}addLibrary`,libObj);
  }


}
