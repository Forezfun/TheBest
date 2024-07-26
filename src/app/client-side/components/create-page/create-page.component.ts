import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { ImageControlService } from '../../services/image-control.service';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { PublicationControlService, interfacePageInformation, interfacePublicationInformation, interfaceServerPublicationInformation } from '../../services/publication-control.service';
import { HttpClientModule } from '@angular/common/http';
import { UserControlService } from '../../services/user-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, ReactiveFormsModule, NgTemplateOutlet, EditorComponent, NgIf, HttpClientModule],
  providers: [],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tinyEditor') tinyEditor!: EditorComponent;
  editorApiKey = "pa2wb6quye1a8vzzmn5v79fq0iwcr78l02u3tohb4401tufu"
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
  currentIdPushedInput: number = 0
  createForm!: FormGroup;
  chooseIconElement!: HTMLImageElement
  editorHtmlElement!: HTMLDivElement
  choosedImage!: HTMLImageElement
  idItem!: string
  routerSub!: Subscription
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
    private formBuilder: FormBuilder
  ) {
    this.userControlService.checkLogin(true)
  }
  ngOnInit(): void {
    this.createForm = new FormGroup({
      title: new FormControl<string>('', Validators.required),
      description: new FormControl<string>('', Validators.required),
      subDescription: new FormControl<string>('', Validators.required),
      decorationImageUrl: new FormControl<string>('', Validators.required),
      nameAddModulesArray: this.formBuilder.array([this.createNameModule()
      ], Validators.required)
    })

    this.routerSub = this.routerSubscribe.paramMap.subscribe(params => {
      const idPublication = params.get('id') as string
      if (idPublication === 'new') return
      this.publicationControlService.GETgetPublication(idPublication)
        .subscribe(
          resolve => {
            this.typePublicationEdit = 'Редактировать'
            console.log(resolve)
            const PUBLICATION_SERVER_DATA_OBJECT = resolve as interfaceServerPublicationInformation
            if (PUBLICATION_SERVER_DATA_OBJECT.author !== this.userControlService.getUserInCookies()!._id) {
              this.router.navigateByUrl('/**');
              return;
            }
            PUBLICATION_SERVER_DATA_OBJECT.nameAddModulesArray.push({ namePage: '', codePage: '' })
            this.createForm.patchValue({
              title: PUBLICATION_SERVER_DATA_OBJECT.title,
              description: PUBLICATION_SERVER_DATA_OBJECT.description,
              subDescription: PUBLICATION_SERVER_DATA_OBJECT.subDescription,
            });
            this.setNameModulesArray(PUBLICATION_SERVER_DATA_OBJECT.nameAddModulesArray);
            console.log(this.createForm.value)
            this.choosedImage.src = PUBLICATION_SERVER_DATA_OBJECT.decorationImageUrl
          },
          error => {
            this.router.navigateByUrl('/**')
          }
        )
    })
    this.routerSub.unsubscribe()
  }
  input(input: Event) {
    console.log((input.target as HTMLInputElement).value)
    input.preventDefault()
    console.log(this.createForm.value)
  }
  createNameModule(): FormGroup {
    return this.formBuilder.group({
      namePage: [''],
      codePage: ['']
    });
  }
  consoleLog() {
    console.log(this.createForm.value, 'Valid:', this.createForm.valid)

  }
  setNameModulesArray(modules: interfacePageInformation[]) {
    const modulesArray = this.createForm.get('nameAddModulesArray') as FormArray;
    modulesArray.clear();
    modules.forEach(module => {
      modulesArray.push(this.formBuilder.group({
        namePage: module.namePage,
        codePage: module.codePage
      }));
    });
    this.createForm.setControl('nameAddModulesArray', this.formBuilder.array(modules.map(module => this.formBuilder.group(module))));
  }
  ngAfterViewInit(): void {
    this.chooseIconElement = this.elementOfComponent.nativeElement.querySelector('.chooseImageIcon') as HTMLImageElement
    this.editorHtmlElement = this.elementOfComponent.nativeElement.querySelector('editor') as HTMLDivElement
    this.choosedImage = this.elementOfComponent.nativeElement.querySelector('.choosedImg') as HTMLImageElement
    this.changeDetectorRef.detectChanges()
  }
  ngOnDestroy(): void {

  }
  onSubmit() {
    let PUBLICATION_DATA_OBJECT = { ...this.createForm.value } as interfacePublicationInformation;
    PUBLICATION_DATA_OBJECT.author = this.userControlService.getUserInCookies()!._id;
    PUBLICATION_DATA_OBJECT.nameAddModulesArray = PUBLICATION_DATA_OBJECT.nameAddModulesArray.filter(page =>
      page.namePage && page.codePage
    );
    if (this.typePublicationEdit === 'Опубликовать') {
      this.publicationControlService.POSTcreatePublication(PUBLICATION_DATA_OBJECT)
    } else {
      this.publicationControlService.PUTupdatePublication(this.routerSubscribe.snapshot.paramMap.get('id')!, PUBLICATION_DATA_OBJECT)
    }
    this.router.navigateByUrl('/account')
  }
  getAll() {
    this.publicationControlService.GETgetAllPublications()
  }
  getOne() {
    this.publicationControlService.GETgetPublication(this.idItem)
      .subscribe(
        resolve => { console.log(resolve) },
        error => { console.log(error) }
      )
  }
  putOne() {
    this.publicationControlService.PUTupdatePublication(this.idItem, this.createForm.value)
  }
  lastID!: string
  deleteOne() {
    this.publicationControlService.DELETEdeletePublication('66a075d58e6e851d5addae3d')

  }
  addNameAddModule() {
    this.createForm.value.nameAddModulesArray.push({ namePage: '', codePage: '' })
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
      this.createForm.value.decorationImageUrl = READER_RESULT
      if (this.elementOfComponent.nativeElement.offsetWidth <= 550) return
      this.renderer2.addClass(this.chooseIconElement, 'disabled');
    };
  }
  checkForChange(idInputs: number) {
    const PARENT_ELEMENT = this.elementOfComponent.nativeElement.querySelector(`[data-idInputs="${idInputs}"]`).parentElement
    const HTML_NAME_INPUT_VALUE = (PARENT_ELEMENT.querySelector('input') as HTMLInputElement).value
    const PAGE_VALUE = this.createForm.value.nameAddModulesArray[idInputs].codePage
    this.createForm.value.nameAddModulesArray[idInputs].namePage = HTML_NAME_INPUT_VALUE
    console.log(this.createForm.value.nameAddModulesArray[idInputs])
    if (HTML_NAME_INPUT_VALUE.length < 2 || !PAGE_VALUE || idInputs !== this.createForm.value.nameAddModulesArray.length - 1) return
    this.addNameAddModule()
  }
  inputsChangeForAddModule(eventTarget: EventTarget) {
    const INPUT_INDEX = +(eventTarget as HTMLInputElement).getAttribute('placeholder')!.replace(/\D/g, '') - 1;
    this.checkForChange(INPUT_INDEX)
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
  acceptUserPublication() {
    this.createForm.value.nameAddModulesArray[this.currentIdPushedInput].codePage = this.tinyEditor.editor.getContent()
    this.checkForChange(this.currentIdPushedInput)
    this.closeEditorPagePublication()
    this.tinyEditor.editor.setContent('')
  }
}
