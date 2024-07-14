import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserControlService } from '../../services/user-control.service';
import { interfaceRequestData, interfaceUserAccount } from '../../services/user-control.service';
import { Router } from '@angular/router';
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
  @ViewChild('enterEmail', { read: TemplateRef }) emailTemplate!: TemplateRef<any>
  @ViewChild('enterCode', { read: TemplateRef }) codeTemplate!: TemplateRef<any>
  @ViewChild('resetPassword', { read: TemplateRef }) resetTemplate!: TemplateRef<any>
  currentTemplate!: TemplateRef<any>
  loginForm!: FormGroup;
  loginSpanHtmlElement!: HTMLSpanElement

  constructor(private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private elementOfComponent: ElementRef, private userControlService: UserControlService, private router: Router) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(8)]),
      // code: new FormControl('',[Validators.minLength(6)]),
      // resetPassword: new FormControl('',[Validators.minLength(8)]),
      // resetPasswordCheck: new FormControl(''),
    });

  }
  ngAfterViewInit(): void {
    this.currentTemplate = this.loginTemplate;
    this.changeDetectorRef.detectChanges();
    this.loginSpanHtmlElement = this.elementOfComponent.nativeElement.querySelector('.loginSpan') as HTMLSpanElement
  }

  loginUser() {
    const REQUEST_DATA: interfaceRequestData = {
      email: 'table88@mail.ru',
      password: 'officetea'
    }
    const REQUEST_RESULT = this.userControlService.requestUserInformation(REQUEST_DATA)
    if (!REQUEST_RESULT) { return }
    if(!this.userControlService.getUserAccountInCookies()){this.userControlService.setUserAccountInCookies(REQUEST_RESULT)}
    this.redirectToAccountPage();
  }
  redirectToAccountPage() {
    this.userControlService.getUserAccountInCookies()
    this.router.navigate(['/account']);
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
      }
    }, 400)
    this.opacityAnimation()
  }
  checkLoginedUser() {

  }

}
