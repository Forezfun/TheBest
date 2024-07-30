import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { CommonModule, NgFor, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { interfaceServerUserData, interfaceUserCookie, UserControlService } from '../../services/user-control.service';
import { Router } from '@angular/router';
import {Observable, of } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, NgTemplateOutlet, ReactiveFormsModule,CommonModule,NgxSpinnerModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent implements AfterViewInit, OnInit {
  @ViewChild('baseInformationTemplate', { read: TemplateRef }) private informationTemplate!: TemplateRef<any>;
  @ViewChild('changeAccountInformation', { read: TemplateRef }) private changeInformationTemplate!: TemplateRef<any>;
  @ViewChild('accountTemplate', { read: TemplateRef }) private accountTemplate!: TemplateRef<any>;
  @ViewChild('publicationsTemplate', { read: TemplateRef }) private publicationsTemplate!: TemplateRef<any>;
  currentInformationTemplate!: TemplateRef<any>
  currentSwitcherTemplate!: TemplateRef<any>
  changeInformationForm!: FormGroup;
  userInformation$?: Observable<interfaceServerUserData>;
  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    private elementOfComponent: ElementRef,
    private userControlService: UserControlService,
    private router: Router,
    private spinner:NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.userControlService.checkLogin(true)
    this.changeInformationForm = this.formBuilder.group({
      nickname: new FormControl(''),
      password: new FormControl('')
    })
    const userDataObject = this.userControlService.getUserInCookies()
    console.log(userDataObject)
    if(!userDataObject)return
    this.spinner.show()
    this.userControlService.GETgetUserOnServer(userDataObject)
    .subscribe({
      next:(resolve)=>{
        const USER_SERVER_DATA_OBJECT:interfaceServerUserData = resolve as interfaceServerUserData
        this.userInformation$=of({
          email:USER_SERVER_DATA_OBJECT.email,
          nickname:USER_SERVER_DATA_OBJECT.nickname,
          password:USER_SERVER_DATA_OBJECT.password,
          publications:USER_SERVER_DATA_OBJECT.publications
        })
      },
      error:(error)=>{
        console.log(error)
        this.spinner.hide()
      }
  })
  }
  ngAfterViewInit(): void {
    this.currentInformationTemplate = this.informationTemplate
    this.currentSwitcherTemplate = this.accountTemplate
    this.changeDetectorRef.detectChanges()
  }

  changeTemplate(typeTemplate: 'baseInformation' | 'accountTemplate' | 'changeInformation' | 'publicationsTemplate') {
    switch (typeTemplate) {
      case 'baseInformation':
        this.opacityChange()
        setTimeout(() => { this.currentInformationTemplate = this.informationTemplate }, 450);
        break
      case 'changeInformation':
        this.opacityChange()
        setTimeout(() => { this.currentInformationTemplate = this.changeInformationTemplate }, 450);
        break
      case 'accountTemplate':
        this.changeMainTemplate('information')
        break
      case 'publicationsTemplate':
        this.changeMainTemplate('publications')
    }

  }
  confirmChanges() {
    console.log(this.changeInformationForm.value);
    this.changeUserInformation()
  }
  acceptInformation() {
    console.log(this.changeInformationForm.value);
    this.changeTemplate('baseInformation')
  }
  changeUserInformation(){
    const USER_COOKIE_DATA = this.userControlService.getUserInCookies()
    if(!USER_COOKIE_DATA)return
    let USER_SERVER_DATA_OBJECT = this.changeInformationForm.value
    USER_SERVER_DATA_OBJECT.email=USER_COOKIE_DATA.email
    this.spinner.show()
    this.userControlService.PUTupdateUserOnServer(USER_SERVER_DATA_OBJECT)
    .subscribe({
      next:(resolve)=>{
        const USER_SERVER_DATA_OBJECT:interfaceUserCookie=resolve as interfaceUserCookie
        this.userControlService.setUserInCookies({
          email:USER_SERVER_DATA_OBJECT.email,
          password:USER_SERVER_DATA_OBJECT.password,
          _id:USER_SERVER_DATA_OBJECT._id
        })
        this.spinner.hide()
        this.router.navigateByUrl('/login')
      },
      error:(error)=>{
        console.log(error)
        this.spinner.hide()
      }
  })
  }
  opacityChange() {
    const targetElement = this.elementOfComponent.nativeElement.querySelector('.informationTemplate')
    this.renderer2.addClass(targetElement, 'opacityAnimation')
    setTimeout(() => {
      this.renderer2.removeClass(targetElement, 'opacityAnimation')
    }, 800)
  }
  changeMainTemplate(appearedItem: 'information' | 'publications') {
    const currentElem = this.elementOfComponent.nativeElement.querySelector('.mainTemplate')
    this.renderer2.removeClass(currentElem, 'slideAppearAnimation')
    this.renderer2.addClass(currentElem, 'slideDisappearAnimation')
    setTimeout(() => {
      this.currentSwitcherTemplate = appearedItem == 'information' ? this.accountTemplate : this.publicationsTemplate;
      this.renderer2.removeClass(currentElem, 'slideDisappearAnimation')
      this.renderer2.addClass(currentElem, 'slideAppearAnimation')
    }, 200)
  }
  exitFromAccount(){
    this.userControlService.deleteUserInCookies()
    this.router.navigateByUrl('/login')
  }
  deleteAccount(){
    const USER_COOKIE_DATA = this.userControlService.getUserInCookies()
    if(!USER_COOKIE_DATA)return
    this.spinner.show()
    this.userControlService.DELETEdeleteUserOnServer(USER_COOKIE_DATA)
    .subscribe({
      next:()=>{
          this.exitFromAccount()
          this.spinner.hide()
      },
      error:(error)=>{
        console.log(error)
        this.spinner.hide()
      }
  })
  }
}
