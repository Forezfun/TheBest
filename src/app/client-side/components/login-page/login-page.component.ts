import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserControlService, interfaceServerUserData, interfaceUserServerBaseData, interfaceUserAuthOrResetPassword } from '../../services/user-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GoogleAuthService } from '../../services/google-auth.service';
import { Observable, of } from 'rxjs';
type errorType = 'wrongEmail' | 'lengthPassword' | 'coincidencePassword' | 'wrongCode' | 'absenceUser' | 'default' | 'userExists'
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NavigationPanelComponent, ReactiveFormsModule, CommonModule, NgxSpinnerModule],
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
  googleAuthLink$?: Observable<string>;
  private resetCode!: string
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private elementOfComponent: ElementRef,
    private userControlService: UserControlService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private googleAuthService: GoogleAuthService,
    private routerObservable: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.userControlService.checkLogin(false)
    this.googleRequestUrl()
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
    const routerSub = this.routerObservable.queryParams.subscribe(params => {
      const userCode = params['code']
      if (!userCode) return
      this.spinner.show()
      this.googleAuthService.GETauthUserOnServer(userCode)
        .subscribe({
          next: (resolve) => {
            const USER_DATA = resolve as interfaceUserServerBaseData
            this.userControlService.setSessionId(USER_DATA.sessionId)
            this.userControlService.setUserIdInLocalStorage(USER_DATA._id)
            this.userControlService.setUserTypeInLocalStorage('google')
            this.spinner.hide()
            this.router.navigateByUrl('/account')
          },
          error: (error) => {
            this.spinner.hide()
            console.log(error)
          }
        })
    })
    routerSub.unsubscribe()
  }
  ngAfterViewInit(): void {
    this.currentTemplate = this.loginTemplate;
    this.changeDetectorRef.detectChanges();
    this.loginSpanHtmlElement = this.elementOfComponent.nativeElement.querySelector('.loginSpan') as HTMLSpanElement
  }
  registrateUser() {
    this.spinner.show()
    let OBJECT_FOR_REQUEST: interfaceServerUserData = {
      email: this.registrationForm.value.email,
      nickname: this.registrationForm.value.nickname,
      password: this.registrationForm.value.password,
      publications: []
    }
    this.userControlService.POSTcreateUserOnServer(OBJECT_FOR_REQUEST)
      .subscribe({
        next: (resolve) => {
          const USER_SERVER_DATA_OBJECT = resolve as interfaceUserServerBaseData
          this.userControlService.setSessionId(USER_SERVER_DATA_OBJECT.sessionId)
          this.userControlService.setUserIdInLocalStorage(USER_SERVER_DATA_OBJECT._id)
          this.userControlService.setUserTypeInLocalStorage('email')
          this.spinner.hide()
          this.router.navigateByUrl('/account')
        },
        error: (error) => {
          console.log(error)
          this.spinner.hide()
        },
      })
  }
  loginUser() {
    this.spinner.show()
    this.userControlService.GETauthUserOnServer(this.loginForm.value)
      .subscribe({
        next: (resolve) => {
          console.log(resolve)
          const USER_BASE_DATA = resolve as interfaceUserServerBaseData
          this.userControlService.setSessionId(USER_BASE_DATA.sessionId)
          this.userControlService.setUserIdInLocalStorage(USER_BASE_DATA._id)
          this.userControlService.setUserTypeInLocalStorage('email')
          this.spinner.hide()
          this.router.navigateByUrl('/account')
        },
        error: (error) => {
          console.log(error)
          if (error.status === 404 || error.status === 403)
            this.handleError('absenceUser')
          this.spinner.hide()
        }
      })
  }
  requestResetCode() {
    this.spinner.show()
    this.changeTemplate('code');
    this.userControlService.POSTrequestResetCode(this.enterEmailForm.value.email)
      .subscribe({
        next: (resolve) => {
          this.resetCode = (resolve as { resetCode: string }).resetCode
          this.spinner.hide()
        },
        error: (error) => {
          console.log(error)
          this.spinner.hide()
        },

      })
  }
  matchCode() {
    if (this.enterCodeForm.value.code !== this.resetCode) {
      this.handleError('wrongCode')
      return
    }
    this.changeTemplate('reset');
  }
  resetUserPassword() {
    if (this.resetPasswordForm.value.resetPassword !== this.resetPasswordForm.value.resetPasswordCheck) {
      this.handleError('coincidencePassword')
      return
    }
    const CHANGE_DATA: interfaceUserAuthOrResetPassword = {
      email: this.enterEmailForm.value.email,
      password: this.resetPasswordForm.value.resetPassword
    }
    this.spinner.show()
    this.userControlService.PUTupdateUserPasswordOnServer(CHANGE_DATA)
      .subscribe({
        next: () => {
          this.changeTemplate('login')
          this.spinner.hide()
        },
        error: (error) => {
          console.log(error)
          this.spinner.hide()
        }
      })
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
  handleError(error: errorType) {
    switch (error) {
      case 'userExists':
        this.userError = 'Пользователь уже существует';
        break;
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
  googleRequestUrl() {
    this.googleAuthService.GETgetAuthUrl()
      .subscribe({
        next: (resolve) => {
          this.googleAuthLink$ = of((resolve as { authURL: string }).authURL)
        },
        error: (error) => {
          console.log(error)
        }
      })
  }

}
