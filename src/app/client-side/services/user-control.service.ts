import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { interfacePublicationInformation } from './publication-control.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export interface interfaceUserCookie extends interfaceUser {
  _id: string;
}
export interface interfaceUser {
  email: string;
  password: string;
  resetPassword?:string;
}
export interface interfaceChangePassword{
  email:string;
  nickname:string;
  resetPassword:string;
}
export interface interfaceServerUserPublication {
  namePublication: string;
  idPublication: string;
}
export interface interfaceServerUserData {
  email: string;
  password: string;
  nickname: string;
  publications: interfaceServerUserPublication[]
}
@Injectable({
  providedIn: 'root',
})
export class UserControlService {
  private apiURL = "http://localhost:8010/proxy/user/"
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router
  ) { }
  POSTcreateUserOnServer(userDataObject: interfaceServerUserData) {
    console.log(userDataObject)
    return this.httpClient.post(this.apiURL, userDataObject)
  }
  PUTupdateUserOnServer(userDataObject: interfaceUser) {
    return this.httpClient.put(`${this.apiURL}`, userDataObject)
      .pipe(
        catchError(err => {
            this.deleteUserInCookies()
          return throwError(err);
        })
      )
  }
  PUTupdateUserPasswordOnServer(userDataObject: interfaceUser) {
    userDataObject.resetPassword=userDataObject.password
    return this.httpClient.put(`${this.apiURL}change/`, userDataObject)
    .pipe(
      catchError(err => {
          this.deleteUserInCookies()    
        return throwError(err);
      })
    )
  }
  DELETEdeleteUserOnServer(idUser: string) {
    return this.httpClient.delete(`${this.apiURL}${idUser}`)
  }
  GETgetUserOnServer(paramsObject: interfaceUser) {
    const params = new HttpParams()
      .set('email', paramsObject.email)
      .set('password', paramsObject.password);
    return this.httpClient.get(`${this.apiURL}`, { params })
    .pipe(
      catchError(err => {
          this.deleteUserInCookies()
        return throwError(err);
      })
    )
  }
  POSTrequestResetCode(email: string) {
    return this.httpClient.post(`${this.apiURL}code/`, { email: email })
  }
  setUserInCookies(cookieUserData: interfaceUserCookie) {
    this.cookieService.set('user', JSON.stringify(cookieUserData), { expires: 7, path: '/' })
  }
  getUserInCookies() {
    const USER_COOKIE_DATA = this.cookieService.get('user')
    if (!USER_COOKIE_DATA) return undefined
    return JSON.parse(USER_COOKIE_DATA) as interfaceUserCookie
  }
  deleteUserInCookies() {
    this.cookieService.delete('user', '/')
    this.router.navigate(['/login'])
  }
  checkLogin(reverse: boolean) {
    if (!reverse) {
      if (this.getUserInCookies()) this.router.navigate(['/account'])
      return
    }
    if (!this.getUserInCookies()) this.router.navigate(['/login'])
  }
}
