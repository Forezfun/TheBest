import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NavigationPanelComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  @ViewChild('login') loginTemplate!: TemplateRef<any>
  @ViewChild('enterEmail') emailTemplate!: TemplateRef<any>
  @ViewChild('enterCode') codeTemplate!: TemplateRef<any>
  @ViewChild('resetPassword') resetTemplate!: TemplateRef<any>
  currentTemplate!: TemplateRef<any>
  span!: HTMLSpanElement
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      code: [''],
      resetPassword: [''],
      resetPasswordCheck: ['']
    });
  }
  ngAfterViewInit(): void {
    this.currentTemplate = this.loginTemplate;
    this.cdr.detectChanges();
    this.span = document.querySelector('.loginSpan') as HTMLSpanElement
  }
  loginUser() { }
  opacityAnimation() {
    this.span.classList.add('opacityAnimationClass')
    setTimeout(() => { this.span.classList.remove('opacityAnimationClass') }, 800)
  }
  changeTemplate(nameTemplate: string) {
    setTimeout(() => {
      switch (nameTemplate) {
        case 'login':
          this.currentTemplate = this.loginTemplate;
          break
        case 'forgot':
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
}
