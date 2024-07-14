import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { NgFor, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  
  constructor(private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private renderer2: Renderer2, private elementOfComponent: ElementRef) { }
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
    this.changeTemplate('baseInformation')
  }
  acceptInformation() {
    console.log(this.changeInformationForm.value);
    this.changeTemplate('baseInformation')
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
