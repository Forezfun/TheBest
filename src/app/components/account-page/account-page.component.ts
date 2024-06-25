import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { NgFor,NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule  } from '@angular/forms';
interface userInformation {
  email: string;
  nickname: string;
  password: string;
  photoUrl: string;
  projects: userProject[];
}
interface userProject {
  url: string;
  name: string;
}
@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor,NgTemplateOutlet,ReactiveFormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent implements AfterViewInit,OnInit {
  @ViewChild('accountInformation') accountInformation!: TemplateRef<any>;
  @ViewChild('changeAccountInformation') changeInformation!: TemplateRef<any>;
  currentTemplate!: TemplateRef<any>
  changeInformationForm!:FormGroup;
  exampleUserInformation: userInformation = {
    email: 'windowspls@mail.ru',
    nickname: 'Forezfun',
    password: 'testpassword',
    photoUrl: 'assets/images/accountPhoto.png',
    projects: [
      {
        url: 'notfound',
        name: 'История Iphone'
      },
      {
        url: 'notfound',
        name: 'История Ipad'
      },
      {
        url: 'notfound',
        name: 'История Windows'
      }
    ]
  }
  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef){}
  ngAfterViewInit(): void {
    this.currentTemplate=this.accountInformation
    this.cdr.detectChanges()
  }
  ngOnInit(): void {
    this.changeInformationForm=this.fb.group({
      nickname:new FormControl(''),
      email:new FormControl(''),
      password:new FormControl('')
    })
  }
  openChangeTemplate(){
    this.currentTemplate=this.changeInformation
    this.cdr.detectChanges()
  }
  openDefaultTemplate(){
    this.currentTemplate=this.accountInformation
    this.cdr.detectChanges()
  }
  confirmChanges(){
    console.log(this.changeInformationForm.value);
    this.openDefaultTemplate()
  }
}
