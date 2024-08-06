import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
export interface interfaceUserServerBaseData {
  sessionId: string;
  _id: string;
}
export interface interfaceUserChange {
  nickname: string;
  password?: string;
}
export interface interfaceUserAuthOrResetPassword {
  email: string;
  password: string;
}
export interface interfaceServerUserPublication {
  namePublication: string;
  idPublication: string;
}
export interface interfaceServerUserData {
  email: string;
  password?: string;
  nickname: string;
  publications: interfaceServerUserPublication[];
  sessionId?: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserControlService {
  private apiURL = "http://localhost:8010/proxy/user/"
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  POSTcreateUserOnServer(userDataObject: interfaceServerUserData) {
    return this.httpClient.post(this.apiURL, userDataObject)
  }
  PUTupdateUserOnServer(updateData: interfaceUserChange,userBaseData: interfaceUserServerBaseData) {
    const data = { ...updateData, _id: userBaseData._id, sessionId: userBaseData.sessionId }
    return this.httpClient.put(`${this.apiURL}changeinformation`, data)
  }
  PUTupdateUserPasswordOnServer(userDataObject: interfaceUserAuthOrResetPassword) {
    return this.httpClient.put(`${this.apiURL}changepassword`, userDataObject)
  }
  DELETEdeleteUserOnServer(userBaseData: interfaceUserServerBaseData) {
    const params = new HttpParams()
      .set('userId', userBaseData._id)
      .set('sessionId', userBaseData.sessionId)
    return this.httpClient.delete(`${this.apiURL}`, { params })
  }
  GETauthUserOnServer(userDataObject: interfaceUserAuthOrResetPassword) {
    const params = new HttpParams()
      .set('email', userDataObject.email)
      .set('password', userDataObject.password);
    return this.httpClient.get(`${this.apiURL}auth`, { params })
  }
  GETgetUserOnServer(userBaseData: interfaceUserServerBaseData) {
    const params = new HttpParams()
      .set('userId', userBaseData._id)
      .set('sessionId', userBaseData.sessionId);
    return this.httpClient.get(`${this.apiURL}`, { params })
  }
  POSTrequestResetCode(email: string) {
    return this.httpClient.post(`${this.apiURL}code`, { email: email })
  }
  setUserIdInLocalStorage(userId: string) {
    if (isPlatformBrowser(this.platformId)) { localStorage.setItem('userId', userId) }
  }
  getUserIdInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const USER_ID = localStorage.getItem('userId')
      return !USER_ID ? undefined : USER_ID
    } else {
      return undefined
    }
  }
  deleteUserIdInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) { localStorage.removeItem('userId') }
  }
  getUserTypeInLocalStorage(){
    if (isPlatformBrowser(this.platformId)) {
      const USER_ID = localStorage.getItem('userType')
      return !USER_ID ? undefined : USER_ID
    } else {
      return undefined
    }
  }
  setUserTypeInLocalStorage(userType: 'google'|'email') {
    if (isPlatformBrowser(this.platformId)) { localStorage.setItem('userType', userType) }
  }
  deleteUserTypeInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) { localStorage.removeItem('userType') }
  }
  getSessionId() {
    if (isPlatformBrowser(this.platformId)) {
      const sessionData = sessionStorage.getItem('sessionId')
      return !sessionData ? undefined : sessionData
    } else {
      return undefined
    }
  }
  setSessionId(sessionId: string) { 
    if (isPlatformBrowser(this.platformId)) { sessionStorage.setItem('sessionId', sessionId) }
  }
  deleteSessionID() {
    if (isPlatformBrowser(this.platformId)) {sessionStorage.removeItem('sessionId')}
  }
  deleteLocalUser() {
    this.deleteSessionID()
    this.deleteUserIdInLocalStorage()
    this.deleteUserTypeInLocalStorage()
    this.router.navigateByUrl('/login')
  }

  checkLogin(reverse: boolean) {
    if (!reverse) {
      if (this.getUserIdInLocalStorage()) {  this.router.navigateByUrl('/account') }
      return
    }
    if (!this.getUserIdInLocalStorage()) {  this.router.navigateByUrl('/login') }
  }
}
