import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserControlService } from './user-control.service';
export interface interfacePageInformation {
  namePage: string;
  codePage: string;
}
export interface interfacePublicationInformation {
  title: string;
  description: string;
  subDescription: string;
  decorationImageUrl: string;
  nameAddModulesArray: interfacePageInformation[];
  author:string;
}
export interface interfaceServerPublicationInformation extends interfacePublicationInformation{
  _id:string; 
}
@Injectable({
  providedIn: 'root'
})
export class PublicationControlService {
  private apiURL = 'http://localhost:8010/proxy/publication/'
  constructor(private httpClient: HttpClient, private userControlService: UserControlService) { }
  POSTcreatePublication(informationPublication: interfacePublicationInformation) {
    return this.httpClient.post(this.apiURL, informationPublication)
    .subscribe(
      resolve=>{
        let USER_DATA_OBJECT=this.userControlService.getUserInCookies()
        if(!USER_DATA_OBJECT)return
        console.log(USER_DATA_OBJECT)
        // this.userControlService.PUTupdateUserOnServer(USER_DATA_OBJECT)
        // .subscribe(
        //   resolve=>{
        //     console.log(resolve)
        //   },
        //   error=>{
        //     console.log(error)
        //   }
        // )
      },
      error=>{console.log(error)}
    )
  }
  PUTupdatePublication(idPublication: string, informationPublication: interfacePublicationInformation) {
    console.log(idPublication)
    return this.httpClient.put(`${this.apiURL}${idPublication}`, informationPublication)
      .subscribe(
        resolve => { 
          console.log(resolve)
          let USER_DATA_OBJECT=this.userControlService.getUserInCookies()
          if(!USER_DATA_OBJECT)return
          this.userControlService.PUTupdateUserOnServer(USER_DATA_OBJECT)
         },
        error => { console.log(error) }
      )
  }
  GETgetAllPublications() {
    return this.httpClient.get(this.apiURL)
  }
  GETgetPublication(idPublication: string) {
    console.log(idPublication)
    return this.httpClient.get(`${this.apiURL}${idPublication}`)
  }
  DELETEdeletePublication(idPublication: string) {
    console.log(idPublication)
    return this.httpClient.delete(`${this.apiURL}${idPublication}`)
      .subscribe(
        resolve => {
          console.log(resolve)
          let USER_DATA_OBJECT=this.userControlService.getUserInCookies()
          if(!USER_DATA_OBJECT)return
          this.userControlService.PUTupdateUserOnServer(USER_DATA_OBJECT)
        },
        error => { console.log(error) }
      )
  }
  updateUserInformation(){
    
  }
}
