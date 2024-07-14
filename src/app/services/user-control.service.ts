import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
export interface interfaceRequestData {
  email: string;
  password:string;
}
export interface interfaceUserAccount extends interfaceRequestData{
  nickname: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserControlService {
  constructor(private cookieService: CookieService) { }
  createUserAccountOnServer() {

  }
  setUserAccountInCookies(cookieUserData: interfaceUserAccount) {
    this.cookieService.set('userAccount', JSON.stringify(cookieUserData), { expires: 7 })
  }
  getUserAccountInCookies() {
    const USER_COOKIE_DATA=this.cookieService.get('userAccount')
    return USER_COOKIE_DATA?JSON.parse(USER_COOKIE_DATA):false
  }
  deleteUserAccountInCookies() {
    this.cookieService.delete('userAccount')
  }
  requestUserInformation(requestUserData:interfaceRequestData): interfaceUserAccount | false {
    // requestFunction
    const REQUEST_RESULT: interfaceUserAccount = {
      nickname: 'Forezfun-',
      email: 'table88@mail.ru',
      password:'officetea'
    }
    return REQUEST_RESULT?REQUEST_RESULT:false
  }
}
