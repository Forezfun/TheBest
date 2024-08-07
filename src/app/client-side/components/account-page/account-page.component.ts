import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { CommonModule, NgFor, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { interfaceServerUserData, interfaceUserChange, interfaceUserServerBaseData, UserControlService } from '../../services/user-control.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GoogleAuthService } from '../../services/google-auth.service';
@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, NgTemplateOutlet, ReactiveFormsModule, CommonModule, NgxSpinnerModule],
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
    private spinner: NgxSpinnerService,
    private googleAuthService: GoogleAuthService
  ) { }
  
  ngOnInit(): void {
    this.userControlService.checkLogin(true)
    this.changeInformationForm = this.formBuilder.group({})
    const SESSION_ID = this.userControlService.getSessionIdInLocalStorage()
    const USER_ID = this.userControlService.getUserIdInLocalStorage()
    const USER_TYPE = this.userControlService.getUserTypeInLocalStorage()
    if (!SESSION_ID || !USER_ID || !USER_TYPE) { this.exitFromAccount(); return }
    this.spinner.show()
    const USER_BASE_DATA = {
      sessionId: SESSION_ID,
      _id: USER_ID
    } as interfaceUserServerBaseData
    if (USER_TYPE === 'email') {
      this.userControlService.GETgetUserOnServer(USER_BASE_DATA)
        .subscribe({
          next: (resolve) => {
            const USER_SERVER_DATA_OBJECT: interfaceServerUserData = resolve as interfaceServerUserData
            this.userInformation$ = of({
              email: USER_SERVER_DATA_OBJECT.email,
              nickname: USER_SERVER_DATA_OBJECT.nickname,
              password: USER_SERVER_DATA_OBJECT.password,
              publications: USER_SERVER_DATA_OBJECT.publications
            })
            this.changeInformationForm.addControl('nickname', new FormControl(USER_SERVER_DATA_OBJECT.nickname, [Validators.required, Validators.minLength(1)]))
            this.changeInformationForm.addControl('password', new FormControl(USER_SERVER_DATA_OBJECT.password, [Validators.required, Validators.minLength(8)]))
            this.spinner.hide()
          },
          error: (error) => {
            this.exitFromAccount()
            this.spinner.hide()
          }
        })

    } else {
      this.googleAuthService.GETgetUserDataOnServer(USER_BASE_DATA)
        .subscribe({
          next: (resolve) => {
            const USER_SERVER_DATA_OBJECT: interfaceServerUserData = resolve as interfaceServerUserData
            this.userInformation$ = of({
              email: USER_SERVER_DATA_OBJECT.email,
              nickname: USER_SERVER_DATA_OBJECT.nickname,
              publications: USER_SERVER_DATA_OBJECT.publications
            })
            this.changeInformationForm.addControl('nickname', new FormControl(USER_SERVER_DATA_OBJECT.nickname, [Validators.required, Validators.minLength(3)]))
            this.spinner.hide()
          },
          error: (error) => {
            this.spinner.hide()
          }
        })

    }
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
        setTimeout(() => { this.currentInformationTemplate = this.informationTemplate }, 500);
        break
      case 'changeInformation':
        this.opacityChange()
        setTimeout(() => { this.currentInformationTemplate = this.changeInformationTemplate }, 500);
        break
      case 'accountTemplate':
        this.changeMainTemplate('information')
        break
      case 'publicationsTemplate':
        this.changeMainTemplate('publications')
    }

  }
  confirmChanges() {
    this.changeUserInformation()
  }
  cancelChanges() {
    this.changeTemplate('baseInformation')
  }
  changeUserInformation() {
    const SESSION_ID = this.userControlService.getSessionIdInLocalStorage()
    const USER_ID = this.userControlService.getUserIdInLocalStorage()
    const USER_TYPE = this.userControlService.getUserTypeInLocalStorage()
    if (!SESSION_ID || !USER_ID || !USER_TYPE) { this.exitFromAccount(); return }
    let USER_UPDATE_DATA: interfaceUserChange = { nickname: this.changeInformationForm.value.nickname }
    this.spinner.show()
    if (USER_TYPE === 'email') {
      USER_UPDATE_DATA = { ...USER_UPDATE_DATA, password: this.changeInformationForm.value.password }
    }
    const HANDLE_SERVICE = USER_TYPE === 'email' ? this.userControlService : this.googleAuthService
    HANDLE_SERVICE.PUTupdateUserOnServer(USER_UPDATE_DATA,
      {
        sessionId: SESSION_ID,
        _id: USER_ID
      }
    )
      .subscribe({
        next: (resolve) => {
          this.spinner.hide()
          this.router.navigateByUrl('/login')
        },
        error: (error) => {
          this.spinner.hide()
        }
      })

  }
  opacityChange() {
    const targetElement = this.elementOfComponent.nativeElement.querySelector('.accountCardTemplate')
    this.renderer2.addClass(targetElement, 'opacityAnimation')
    setTimeout(() => {
      this.renderer2.removeClass(targetElement, 'opacityAnimation')
    }, 1000)
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
  exitFromAccount() {
    this.userControlService.deleteLocalUser()
  }
  deleteAccount() {
    const SESSION_ID = this.userControlService.getSessionIdInLocalStorage()
    const USER_ID = this.userControlService.getUserIdInLocalStorage()
    const USER_TYPE = this.userControlService.getUserTypeInLocalStorage()
    if (!SESSION_ID || !USER_ID || !USER_TYPE) { this.exitFromAccount(); return }
    this.spinner.show()
    const USER_BASE_DATA = {
      sessionId: SESSION_ID,
      _id: USER_ID
    } as interfaceUserServerBaseData
    const HANDLE_SERVICE = USER_TYPE === 'email' ? this.userControlService : this.googleAuthService
    HANDLE_SERVICE.DELETEdeleteUserOnServer(USER_BASE_DATA)
      .subscribe({
        next: () => {
          this.exitFromAccount()
          this.spinner.hide()
        },
        error: (error) => {
          this.spinner.hide()
        }
      })
  }
}
