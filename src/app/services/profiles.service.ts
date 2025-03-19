import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';



@Injectable({
  providedIn: 'root'
})


export class ProfilesService {

  http = inject(HttpClient);

  //get All Profiles
  getAllProfileService() {
    return this.http.get(`${apiUrls.profileManage}getAll`);
  };


  //get profile by id
  getProfileByIdService(id: any) {
    return this.http.get(`http://3.223.253.106:5966/api/profile${id}`);
  };

  //update profile details by id
  updateProfileService(data: any, id: number) {
    return this.http.put(`${apiUrls.profileManage}id`, data);
  };

  //delete profile by id
  deleteProfileService(id: any) {
    return this.http.delete(`http://3.223.253.106:5966/api/profile${id}`);
  };

}
