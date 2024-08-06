import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interfaceUserChange, interfaceUserServerBaseData } from './user-control.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  constructor(
    private httpClient:HttpClient
  ) { }
  private apiURL = 'http://localhost:8010/proxy/google/'
  GETgetAuthUrl(){
    return this.httpClient.get(`${this.apiURL}geturl`)
  }
  GETauthUserOnServer(code:string){
    const params = new HttpParams()
    .set('code', code)
    return this.httpClient.get(`${this.apiURL}auth`,{params})
  }
  GETgetUserDataOnServer(userBaseData:interfaceUserServerBaseData){
    const params = new HttpParams()
    .set('userId', userBaseData._id)
    .set('sessionId', userBaseData.sessionId)
    return this.httpClient.get(`${this.apiURL}`,{params})
  }
  PUTupdateUserOnServer(updateData:interfaceUserChange,userBaseData:interfaceUserServerBaseData){
    const UPDATE_SERVER_DATA = {...updateData,...userBaseData}
    return this.httpClient.put(`${this.apiURL}changeinformation`,UPDATE_SERVER_DATA)
  }
  DELETEdeleteUserOnServer(userBaseData:interfaceUserServerBaseData){
    const params = new HttpParams()
    .set('userId', userBaseData._id)
    .set('sessionId', userBaseData.sessionId)
    return this.httpClient.delete(`${this.apiURL}`,{params})
  }
}
