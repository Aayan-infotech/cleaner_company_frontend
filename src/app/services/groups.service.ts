import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})

export class GroupsService {

  constructor( private http: HttpClient) {}

  // Group Section

  // Create Group
  createGroupService(data: any): Observable<any> {
    return this.http.post(`${apiUrls.groupsManageApi}create`, data);
  }

  // Get all Groups
  getAllGroupsService(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${apiUrls.groupsManageApi}getAll`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  // GEt all  Groups with No Pagination
  getAllGroupsNoPaginationService(): Observable<any> {
    return this.http.get<any>(`${apiUrls.groupsManageApi}get-all-no-paginated`);
  }

  // Get Group By Id
  getGroupByIdService(id: any): Observable<any> {
    return this.http.get<any>(`${apiUrls.groupsManageApi}getById/${id}`);
  }

  // Update Group Details By Id
  updateGroupByIdService(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${apiUrls.groupsManageApi}update/${id}`, data);
  }

  // Delete Group by Id
  deleteGroupByIdService(id: any): Observable<any> {
    return this.http.delete<any>(`${apiUrls.groupsManageApi}delete/${id}`);
  }

  // Add clients into Section

  // Get All Clients
  getAllClientsService(): Observable<any> {
    return this.http.get<any>(`${apiUrls.crmMgmtApi}get-all-clients`);
  }

  // Add Client By Passing GroupId in Params
  addClientsToGroup(groupId: string, clients: string[]): Observable<any> {
    return this.http.post(`${apiUrls.groupsManageApi}addClients/${groupId}`, { clients });
  }

  // Add Group in Group
  addGroupToGroupService(groupId: string, groups: string[]): Observable<any> {
    return this.http.post(`${apiUrls.groupsManageApi}addGroups/${groupId}`, { groups });
  }

  // All Childs Group in Parent Group
  getAllChildGroupByParentGroupIdService(groupId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.groupsManageApi}getGroups/${groupId}`);
  }

  // Remove Client By Id
  removeClientFromGroup(groupId: string, clientId: string): Observable<any> {
    return this.http.delete(`${apiUrls.groupsManageApi}delete/${groupId}/${clientId}`);
  }

  // Remove Group By Id
  removeGroupFromGroup(groupId: string, subGroupId: string): Observable<any> {
    return this.http.delete(`${apiUrls.groupsManageApi}delete-group/${groupId}/${subGroupId}`);
  }

}
