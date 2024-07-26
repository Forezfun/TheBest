import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { NgFor, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { interfaceServerUserData, interfaceUserCookie, UserControlService } from '../../services/user-control.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent implements AfterViewInit, OnInit {
  @ViewChild('baseInformationTemplate', { read: TemplateRef }) private informationTemplate!: TemplateRef<any>;
  @ViewChild('changeAccountInformation', { read: TemplateRef }) private changeInformationTemplate!: TemplateRef<any>;
  @ViewChild('accountTemplate', { read: TemplateRef }) private accountTemplate!: TemplateRef<any>;
  @ViewChild('projectsTemplate', { read: TemplateRef }) private projectsTemplate!: TemplateRef<any>;
  currentInformationTemplate!: TemplateRef<any>
  currentSwitcherTemplate!: TemplateRef<any>
  changeInformationForm!: FormGroup;
  userInformation!: interfaceServerUserData

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    private elementOfComponent: ElementRef,
    private userControlService: UserControlService,
    private router: Router
  ) { 
    this.userControlService.checkLogin(true)
  }
  ngAfterViewInit(): void {
    this.currentInformationTemplate = this.informationTemplate
    this.currentSwitcherTemplate = this.accountTemplate
    this.changeDetectorRef.detectChanges()
  }
  ngOnInit(): void {
    this.changeInformationForm = this.formBuilder.group({
      nickname: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    })
    const userDataObject = this.userControlService.getUserInCookies()
    console.log(userDataObject)
    if(!userDataObject)return
    this.userControlService.GETgetUserOnServer(userDataObject)
    .subscribe(
      resolve=>{
        const USER_SERVER_DATA_OBJECT:interfaceServerUserData = resolve as interfaceServerUserData
        this.userInformation={
          email:USER_SERVER_DATA_OBJECT.email,
          nickname:USER_SERVER_DATA_OBJECT.nickname,
          password:USER_SERVER_DATA_OBJECT.password,
          publications:USER_SERVER_DATA_OBJECT.publications
        }
        console.log(this.userInformation)
      },
      error=>{
        console.log(error)
      }
    )
  }

  changeTemplate(typeTemplate: 'baseInformation' | 'accountTemplate' | 'changeInformation' | 'projectsTemplate') {
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
      case 'projectsTemplate':
        this.changeMainTemplate('projects')
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
    this.userControlService.PUTupdateUserOnServer(this.changeInformationForm.value)
    .subscribe(
      resolve=>{
        const USER_SERVER_DATA_OBJECT:interfaceUserCookie=resolve as interfaceUserCookie
        this.userControlService.setUserInCookies({
          email:USER_SERVER_DATA_OBJECT.email,
          password:USER_SERVER_DATA_OBJECT.password,
          _id:USER_SERVER_DATA_OBJECT._id
        })
        this.router.navigateByUrl('/login')
      },
      error=>{
        console.log(error)
      }
    )
  }
  opacityChange() {
    const targetElement = this.elementOfComponent.nativeElement.querySelector('.informationTemplate')
    this.renderer2.addClass(targetElement, 'opacityAnimation')
    setTimeout(() => {
      this.renderer2.removeClass(targetElement, 'opacityAnimation')
    }, 800)
  }
  changeMainTemplate(appearedItem: 'information' | 'projects') {
    const currentElem = this.elementOfComponent.nativeElement.querySelector('.mainTemplate')
    this.renderer2.removeClass(currentElem, 'slideAppearAnimation')
    this.renderer2.addClass(currentElem, 'slideDisappearAnimation')
    setTimeout(() => {
      this.currentSwitcherTemplate = appearedItem == 'information' ? this.accountTemplate : this.projectsTemplate;
      this.renderer2.removeClass(currentElem, 'slideDisappearAnimation')
      this.renderer2.addClass(currentElem, 'slideAppearAnimation')
    }, 200)
  }
}
