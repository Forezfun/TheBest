import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserControlService } from '../../services/user-control.service';
import { interfacePublicationInformation, interfaceServerPublicationInformation } from '../../services/publication-control.service';
import { interfaceUserCookie, interfaceServerUserData,interfaceUser } from '../../services/user-control.service';
import { Router } from '@angular/router';
import { error } from 'console';
type errorType = 'wrongEmail' | 'lengthPassword' | 'coincidencePassword' | 'wrongCode' | 'absenceUser' | 'default'
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NavigationPanelComponent, ReactiveFormsModule, CommonModule],
  providers: [UserControlService],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit, AfterViewInit {
  @ViewChild('login', { read: TemplateRef }) loginTemplate!: TemplateRef<any>
  @ViewChild('registration', { read: TemplateRef }) registrationTemplate!: TemplateRef<any>
  @ViewChild('enterEmail', { read: TemplateRef }) emailTemplate!: TemplateRef<any>
  @ViewChild('enterCode', { read: TemplateRef }) codeTemplate!: TemplateRef<any>
  @ViewChild('resetPassword', { read: TemplateRef }) resetTemplate!: TemplateRef<any>
  currentTemplate!: TemplateRef<any>
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  enterEmailForm!: FormGroup;
  enterCodeForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  loginSpanHtmlElement!: HTMLSpanElement
  userError: string = ' '
  private resetCode!: number
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private elementOfComponent: ElementRef,
    private userControlService: UserControlService,
    private router: Router
  ) {
    this.userControlService.checkLogin(true)
  }
  ngOnInit(): void {
    this.userControlService.checkLogin(false)
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
    });
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
      nickname: new FormControl('', [Validators.required]),
    });
    this.enterEmailForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
    this.enterCodeForm = new FormGroup({
      code: new FormControl('', [Validators.minLength(6), Validators.required]),
    });
    this.resetPasswordForm = new FormGroup({
      resetPassword: new FormControl('', [Validators.minLength(8), Validators.required]),
      resetPasswordCheck: new FormControl('', Validators.required),
    });
  }
  ngAfterViewInit(): void {
    this.currentTemplate = this.loginTemplate;
    this.changeDetectorRef.detectChanges();
    this.loginSpanHtmlElement = this.elementOfComponent.nativeElement.querySelector('.loginSpan') as HTMLSpanElement
  }

  getUser() {
    this.userControlService.GETgetUserOnServer({ email: 'windowspls@mail.ru', password: '4691Forezfun-' })
  }
  putUser() {
    const OBJECT_FOR_REQUEST: interfaceUser = {
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password
    }
    this.userControlService.PUTupdateUserOnServer(OBJECT_FOR_REQUEST)
      .subscribe(
        resolve => {
          console.log(resolve)
        },
        error => { console.log(error) }
      )
  }
  deleteUser() {
    this.userControlService.DELETEdeleteUserOnServer('1')
      .subscribe(
        resolve => {
          console.log(resolve)
        },
        error => { console.log(error) }
      )
  }
  registrateUser() {
    console.log(this.registrationForm.value)
    const OBJECT_FOR_REQUEST: interfaceServerUserData = {
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      nickname: this.registrationForm.value.nickname,
      publications: []
    }
    this.userControlService.POSTcreateUserOnServer(OBJECT_FOR_REQUEST)
      .subscribe(
        resolve => {
          const USER_SERVER_DATA_OBJECT:interfaceUserCookie = resolve as interfaceUserCookie
          this.userControlService.setUserInCookies({
            email: OBJECT_FOR_REQUEST.email,
            password: OBJECT_FOR_REQUEST.password,
            _id:USER_SERVER_DATA_OBJECT._id
          })
          this.router.navigate(['/account']);
        },
        error => { console.log(error) }
      )
  }
  loginUser() {
    this.userControlService.GETgetUserOnServer(this.loginForm.value)
      .subscribe(
        resolve => {
          console.log(resolve)
          const USER_SERVER_DATA_OBJECT = resolve as interfaceUserCookie
          this.userControlService.setUserInCookies({
            email: USER_SERVER_DATA_OBJECT.email,
            password: USER_SERVER_DATA_OBJECT.password,
            _id:USER_SERVER_DATA_OBJECT._id
          })
          this.router.navigate(['/account']);
        },
        error => {
          console.log(error)
          if (error.status === 404) {
            this.handError('absenceUser')
          }
        }
      )
  }
  requestResetCode() {
    this.changeTemplate('code');
    this.userControlService.POSTrequestResetCode(this.enterEmailForm.value.email)
      .subscribe(
        resolve => {
          this.resetCode = (resolve as any).resetCode
        },
        error => { console.log(error) }
      )
  }
  matchCode() {
    if (this.enterCodeForm.value.code !== this.resetCode) {
      this.handError('wrongCode')
      return
    }
    this.changeTemplate('reset');
  }
  resetUserPassword() {
    if (this.resetPasswordForm.value.resetPassword !== this.resetPasswordForm.value.resetPasswordCheck) {
      this.handError('coincidencePassword')
      return
    }
    const DATA_OBJECT: interfaceUser = {
      email: this.enterEmailForm.value.email,
      password:this.resetPasswordForm.value.resetPassword,
      resetPassword: this.resetPasswordForm.value.resetPassword,
    }
    this.userControlService.PUTupdateUserPasswordOnServer(DATA_OBJECT)
      .subscribe(
        resolve => {
          this.changeTemplate('login')
        },
        error => { console.log(error) }
      )
  }
  opacityAnimation() {
    this.loginSpanHtmlElement.classList.add('opacityAnimationClass')
    setTimeout(() => { this.loginSpanHtmlElement.classList.remove('opacityAnimationClass') }, 800)
  }
  changeTemplate(nameTemplate: string) {
    setTimeout(() => {
      switch (nameTemplate) {
        case 'login':
          this.currentTemplate = this.loginTemplate;
          break
        case 'email':
          this.currentTemplate = this.emailTemplate;
          break
        case 'code':
          this.currentTemplate = this.codeTemplate;
          break
        case 'reset':
          this.currentTemplate = this.resetTemplate;
          break
        case 'registrate':
          this.currentTemplate = this.registrationTemplate;
      }
    }, 400)
    this.opacityAnimation()
  }
  handError(error: errorType) {
    switch (error) {
      case 'wrongEmail':
        this.userError = 'Неправильный формат почты';
        break;
      case 'lengthPassword':
        this.userError = 'Длина пароля должна быть не менее 8 символов';
        break;
      case 'coincidencePassword':
        this.userError = 'Пароли не совпадают';
        break;
      case 'wrongCode':
        this.userError = 'Неправильный введенный код';
        break;
      case 'absenceUser':
        this.userError = 'Неверно введенный пароль или email';
        break;
    }
    setTimeout(() => {
      this.userError = ' ';
    }, 2000)
  }
  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }
}
