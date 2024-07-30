import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  author: string;
}
export interface interfaceServerPublicationInformation extends interfacePublicationInformation {
  _id: string;
}
@Injectable({
  providedIn: 'root'
})
export class PublicationControlService {
  private apiURL = 'http://localhost:8010/proxy/publication/'
  constructor(private httpClient: HttpClient, private userControlService: UserControlService) { }
  POSTcreatePublication(informationPublication: interfacePublicationInformation) {
    return this.httpClient.post(this.apiURL, informationPublication)
  }
  PUTupdatePublication(idPublication: string, informationPublication: interfacePublicationInformation) {
    console.log(idPublication)
    return this.httpClient.put(`${this.apiURL}${idPublication}`, informationPublication)
  }
  GETgetAllPublications(findWord: string) {
      const params = new HttpParams()
        .set('findWord', findWord)
        return this.httpClient.get(this.apiURL,{params})
  }
  GETgetPublication(idPublication: string) {
    console.log(idPublication)
    return this.httpClient.get(`${this.apiURL}${idPublication}`)
  }
  DELETEdeletePublication(idPublication: string) {
    console.log(idPublication)
    return this.httpClient.delete(`${this.apiURL}${idPublication}`)

  }
  updateUserInformation() {

  }
}
