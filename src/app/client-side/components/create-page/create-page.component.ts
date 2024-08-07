import { AfterViewInit,ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { ImageControlService } from '../../services/image-control.service';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { PublicationControlService, interfacePublicationInformation, interfaceServerPublicationInformation } from '../../services/publication-control.service';
import { HttpClientModule } from '@angular/common/http';
import { UserControlService } from '../../services/user-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, ReactiveFormsModule, NgTemplateOutlet, EditorComponent, NgIf, HttpClientModule, NgxSpinnerModule],
  providers: [],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss'
})
export class CreatePageComponent implements OnInit, AfterViewInit {
  @ViewChild('tinyEditor') private tinyEditor!: EditorComponent;
  private chooseIconElement!: HTMLImageElement
  private editorHtmlElement!: HTMLDivElement
  private choosedImage!: HTMLImageElement
  private routerSub!: Subscription
  private currentIdPushedInput: number = 0
  editorApiKey = "kted646h6qo85jem7djygvvhmdpjf854nwra0znuhtj0isho"
  editorInitObject: EditorComponent['init'] = {
    selector: 'textarea#tinyEditor',
    resize: false,
    plugins: 'link fullscreen emoticons image link media autoresize autosave table',
    toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | emoticons fullscreen code link ',
    menu: {
      file: { title: 'File', items: 'newdocument restoredraft' },
      view: { title: '', items: '' },
      table: { title: '', items: '' },
      insert: { title: 'Insert', items: 'image media inserttable | emoticons link hr' },
    },
    autoresize_bottom_margin: 250,
    autosave_interval: '10s',
    autosave_retention: '1m',
    autosave_restore_when_empty: false
  }
  createForm!: FormGroup;
  idPublication!: string;
  typePublicationEdit: 'Опубликовать' | 'Редактировать' = 'Опубликовать'

  constructor(
    private renderer2: Renderer2,
    private elementOfComponent: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private publicationControlService: PublicationControlService,
    private imageControlService: ImageControlService,
    private userControlService: UserControlService,
    private router: Router,
    private routerSubscribe: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.userControlService.checkLogin(true)
  }
  arrayLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length > minLength ? null : { length: control.value.length }
    };
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      title: new FormControl<string>('', Validators.required),
      description: new FormControl<string>('', Validators.required),
      subDescription: new FormControl<string>('', Validators.required),
      decorationImageUrl: new FormControl<string>('', Validators.required),
      nameAddModulesArray: this.formBuilder.array([this.createNameModule()
      ], [Validators.required, this.arrayLengthValidator(1)])
    })
    this.routerSub = this.routerSubscribe.paramMap.subscribe(params => {
      this.idPublication = params.get('id') as string
      if (this.idPublication === 'new') return
      this.spinner.show()
      this.publicationControlService.GETgetPublication(this.idPublication)
        .subscribe({
          next: (resolve) => {
            this.typePublicationEdit = 'Редактировать'
            const PUBLICATION_SERVER_DATA_OBJECT = resolve as interfaceServerPublicationInformation
            const USER_ID = this.userControlService.getUserIdInLocalStorage()
            if(!USER_ID)return
            if (PUBLICATION_SERVER_DATA_OBJECT.author !== USER_ID) {
              this.router.navigateByUrl('/**');
              return;
            }
            PUBLICATION_SERVER_DATA_OBJECT.nameAddModulesArray.push({ namePage: '', codePage: '' })
            this.createForm.patchValue({
              title: PUBLICATION_SERVER_DATA_OBJECT.title,
              description: PUBLICATION_SERVER_DATA_OBJECT.description,
              subDescription: PUBLICATION_SERVER_DATA_OBJECT.subDescription,
              decorationImageUrl: PUBLICATION_SERVER_DATA_OBJECT.decorationImageUrl
            });
            this.setNameModulesArray(PUBLICATION_SERVER_DATA_OBJECT.nameAddModulesArray);
            this.choosedImage.src = PUBLICATION_SERVER_DATA_OBJECT.decorationImageUrl
            this.spinner.hide()
          },
          error: (error) => {
            this.spinner.hide()
            this.router.navigateByUrl('/**')
          }
        })
    })
    this.routerSub.unsubscribe()
  }
  ngAfterViewInit(): void {
    this.chooseIconElement = this.elementOfComponent.nativeElement.querySelector('.chooseImageIcon') as HTMLImageElement
      this.editorHtmlElement = this.elementOfComponent.nativeElement.querySelector('editor') as HTMLDivElement
      this.choosedImage = this.elementOfComponent.nativeElement.querySelector('.choosedImg') as HTMLImageElement
      this.changeDetectorRef.detectChanges()
  }

  input(input: Event) {
    input.preventDefault()
  }
  createNameModule(): FormGroup {
    return this.formBuilder.group({
      namePage: [''],
      codePage: ['']
    });
  }
addNameAddModule() {
  const addPagesPublication = this.createForm.get('nameAddModulesArray') as FormArray;
  addPagesPublication.push(this.createNameModule());
  this.setNameModulesArray(addPagesPublication.value);
}
setNameModulesArray(modules: any[]) {
  const modulesArray = this.createForm.get('nameAddModulesArray') as FormArray;
  modulesArray.clear();
  modules.forEach(module => {
    modulesArray.push(this.formBuilder.group(module));
  });
}
onSubmit() {
  let PUBLICATION_DATA_OBJECT = { ...this.createForm.value } as interfacePublicationInformation;
  const USER_ID = this.userControlService.getUserIdInLocalStorage()
  if (!USER_ID) return
  PUBLICATION_DATA_OBJECT.author = USER_ID
  PUBLICATION_DATA_OBJECT.nameAddModulesArray = PUBLICATION_DATA_OBJECT.nameAddModulesArray.filter(page =>
    page.namePage && page.codePage
  );
  this.spinner.show()
  const publicationRequest$ = this.typePublicationEdit === 'Опубликовать'
    ? this.publicationControlService.POSTcreatePublication(PUBLICATION_DATA_OBJECT)
    : this.publicationControlService.PUTupdatePublication(this.routerSubscribe.snapshot.paramMap.get('id')!, PUBLICATION_DATA_OBJECT);

  publicationRequest$.subscribe({
    next:() => {
      this.router.navigateByUrl('/account');
      this.spinner.hide()
    },
    error:(error) => {
      this.spinner.hide()
    }
});
}
onPreviewFileSelect(event: Event): void {
  const IMAGE_INPUT_ELEMENT: HTMLInputElement = event.target as HTMLInputElement;
  const CHOOSED_IMAGE: File = IMAGE_INPUT_ELEMENT.files![0];
  const READER: FileReader = new FileReader();
  READER.readAsDataURL(CHOOSED_IMAGE)
    READER.onload = async () => {
    if (READER.result === null) return
    if (this.choosedImage.naturalWidth > this.choosedImage.naturalHeight) {
      this.choosedImage.style.height = '90%';
    } else {
      this.choosedImage.style.height = 'auto';
    }
    const READER_RESULT = await this.imageControlService.compressBase64(READER.result.toString()) as string
    this.choosedImage.src = READER_RESULT
    this.createForm.patchValue({
      decorationImageUrl: READER_RESULT
    })
    if (this.elementOfComponent.nativeElement.offsetWidth <= 550) return
    this.renderer2.addClass(this.chooseIconElement, 'disabled');
  };
}
checkChangePagesForAddNameMoule(idInputs: number) {
  const PARENT_ELEMENT = this.elementOfComponent.nativeElement.querySelector(`[data-idInputs="${idInputs}"]`).parentElement
  const HTML_NAME_INPUT_VALUE = (PARENT_ELEMENT.querySelector('input') as HTMLInputElement).value
  const PAGE_VALUE = this.createForm.value.nameAddModulesArray[idInputs].codePage
  this.createForm.value.nameAddModulesArray[idInputs].namePage = HTML_NAME_INPUT_VALUE
  if (HTML_NAME_INPUT_VALUE.length < 2 || !PAGE_VALUE || idInputs !== this.createForm.value.nameAddModulesArray.length - 1) return
  this.addNameAddModule()
}
inputsChangeForAddModule(eventTarget: EventTarget) {
  const INPUT_INDEX = +(eventTarget as HTMLInputElement).getAttribute('placeholder')!.replace(/\D/g, '') - 1;
  this.checkChangePagesForAddNameMoule(INPUT_INDEX)
}
openEditor(eventTarget: EventTarget) {
  this.renderer2.removeClass(this.editorHtmlElement.parentElement, 'disabled')
  this.currentIdPushedInput = +(eventTarget as HTMLDivElement).getAttribute('data-idinputs')!
}
closeEditorPagePublication() {
  this.renderer2.addClass(this.editorHtmlElement.parentElement, 'disabled')
}
openEditorWithContent(eventTarget: EventTarget) {
  const PAGE_ID: number = +(eventTarget as HTMLSpanElement).getAttribute('data-idInputs')!
  if (this.createForm.value.nameAddModulesArray[PAGE_ID]) {
    this.tinyEditor.editor.setContent(this.createForm.value.nameAddModulesArray[PAGE_ID].codePage)
  }
  this.openEditor(eventTarget)
}
acceptPageChanges() {
  this.createForm.value.nameAddModulesArray[this.currentIdPushedInput].codePage = this.tinyEditor.editor.getContent()
  this.checkChangePagesForAddNameMoule(this.currentIdPushedInput)
  this.closeEditorPagePublication()
  this.tinyEditor.editor.setContent('')
}
deletePublication() {
  this.spinner.show()
  this.publicationControlService.DELETEdeletePublication(this.idPublication)
    .subscribe({
      next:() => {
        this.spinner.hide()
      this.router.navigateByUrl('/account')
    },
      error:(error) => {
        this.spinner.hide()
      }
})
}
}
