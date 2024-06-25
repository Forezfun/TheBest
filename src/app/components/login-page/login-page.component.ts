import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormBuilder, FormGroup, ReactiveFormsModule,FormControl } from '@angular/forms';
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectorRef, ElementRef} from '@angular/core';
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
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,private el: ElementRef) { }
  @ViewChild('login') loginTemplate!: TemplateRef<any>
  @ViewChild('enterEmail') emailTemplate!: TemplateRef<any>
  @ViewChild('enterCode') codeTemplate!: TemplateRef<any>
  @ViewChild('resetPassword') resetTemplate!: TemplateRef<any>
  currentTemplate!: TemplateRef<any>
  span!: HTMLSpanElement
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:new FormControl(''),
      password: new FormControl(''),
      // email: new FormControl('', [Validators.required, Validators.email]),
      // password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      code: new FormControl(''),
      resetPassword: new FormControl(''),
      resetPasswordCheck: new FormControl(''),
    });
  }
  ngAfterViewInit(): void {
    this.currentTemplate = this.loginTemplate;
    this.cdr.detectChanges();
    this.span = this.el.nativeElement.querySelector('.loginSpan') as HTMLSpanElement
  }
  loginUser() { 
    console.log(this.loginForm.value)
  }
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
