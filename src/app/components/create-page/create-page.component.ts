import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { NgFor,NgTemplateOutlet } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
interface interfaceAddModuleValue{
  file:File;
  name:string;
}
@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, ReactiveFormsModule,NgTemplateOutlet],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss'
})
export class CreatePageComponent implements OnInit, AfterViewInit {
  @ViewChild('nameAddSpan', { read: ViewContainerRef }) private nameAddSpanContainer!: ViewContainerRef
  @ViewChild('addNameModuleTemplate', { read: TemplateRef }) private addNameModuleTemplate!: TemplateRef<any>
  chooseIconElement!: HTMLImageElement
  createForm!: FormGroup;
  imageSrc: string | ArrayBuffer | null = null

  constructor(private formBuilder: FormBuilder, private renderer2: Renderer2, private elementOfComponent: ElementRef,private changeDetectorRef:ChangeDetectorRef) { }
  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      subDescription: ['', Validators.required],
      decorationImage: ['', Validators.required],
      nameAddModulesArray:['',Validators.required]
    })
  }
  ngAfterViewInit(): void {
    this.chooseIconElement=this.elementOfComponent.nativeElement.querySelector('.chooseIcon')
    this.addNameAddModule()
    this.changeDetectorRef.detectChanges()
  }

  onSumbit() {
    this.inputsClaimInformation()
    console.log(this.createForm.value)
  }
  addNameAddModule() {
    const INDEX_OF_ADD_ELEMENT: number = this.nameAddSpanContainer.length
    this.nameAddSpanContainer.createEmbeddedView(this.addNameModuleTemplate, { indexOfElementInList: INDEX_OF_ADD_ELEMENT })
  }
  onFileSelect(event: Event): void {
    const IMAGE_INPUT_ELEMENT = event.target as HTMLInputElement;
    const CHOOSED_IMAGE = IMAGE_INPUT_ELEMENT.files![0];
    this.createForm.value.decorationImage=CHOOSED_IMAGE
    const reader = new FileReader();
    reader.readAsDataURL(CHOOSED_IMAGE)
    reader.onload = () => {
      this.imageSrc = reader.result
      if(this.elementOfComponent.nativeElement.offsetWidth<=550)return
      this.renderer2.addClass(this.chooseIconElement,'disabled')
    };
  }
  inputsClaimInformation(){
    const INPUTS_BLOCK_ELEMENT = this.elementOfComponent.nativeElement.querySelectorAll('.nameAddModule')
    let inputsValues:interfaceAddModuleValue[]=[]
    INPUTS_BLOCK_ELEMENT.forEach((element:HTMLDivElement) => {
      const INPUT_NAME_VALUE:string = (element.querySelector('.inputName') as HTMLInputElement).value
      const INPUT_FILE_VALUE:File = (element.querySelector('.pageAddInput') as HTMLInputElement).files![0];
      if(INPUT_NAME_VALUE.length===0||INPUT_FILE_VALUE===undefined)return
      const ADD_MODULE_VALUE_OBJECT:interfaceAddModuleValue={
        file:INPUT_FILE_VALUE,
        name:INPUT_NAME_VALUE
      }
      inputsValues=[...inputsValues,ADD_MODULE_VALUE_OBJECT]
    })
    this.createForm.value.nameAddModulesArray=inputsValues
  }
  inputsChangeForAddModule(event:Event){
    const PARENT_ADD_MODULE_ELEMENT = (event.target as any).closest('.nameAddModule') as HTMLDivElement;
    const INPUT_ELEMENT = PARENT_ADD_MODULE_ELEMENT.querySelector('.inputName') as HTMLInputElement
    const INPUT_ELEMENT_VALUE = INPUT_ELEMENT.value
    const INPUT_ELEMENT_ID = +INPUT_ELEMENT.getAttribute('placeholder')!.replace(/\D/g, '');
    const FILE_EXISTENCE = (() => {
      return (PARENT_ADD_MODULE_ELEMENT.querySelector('.pageAddInput') as any).files.length>0?true:false
    })();
    if(INPUT_ELEMENT_ID<this.nameAddSpanContainer.length||INPUT_ELEMENT_VALUE.length<2||!FILE_EXISTENCE)return
    this.addNameAddModule()
  }
}
