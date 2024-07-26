import { Component, Input, Output, EventEmitter, AfterViewInit, Renderer2, OnDestroy, ElementRef,PLATFORM_ID, Inject } from '@angular/core';
import { NgFor, isPlatformBrowser } from '@angular/common';
import { interfacePageInformation } from '../../services/publication-control.service';
@Component({
  selector: 'app-dots-bar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dots-bar.component.html',
  styleUrl: './dots-bar.component.scss'
})
export class DotsBarComponent implements AfterViewInit{
  constructor(private renderer2: Renderer2,private elementOfComponent:ElementRef,@Inject(PLATFORM_ID) private platformId: Object) { }
  @Input() dotsArray!: interfacePageInformation[]
  @Output() pointIdEmitter = new EventEmitter<number>();
  private currentDotId: number = 0;
  private dotsElementsArray!: NodeListOf<Element>

  ngAfterViewInit() {
    this.dotsElementsArray = this.elementOfComponent.nativeElement.querySelectorAll('.dot')
    this.dotsElementsArray[0].classList.add('active')
  }
  chooseDot(event: any) {
    const idChoosedDot = +event.target.querySelector('div').getAttribute('id')
    this.changeActiveDot(idChoosedDot, this.currentDotId)
    this.currentDotId = idChoosedDot
  }
  changeActiveDot(newDotId: number, lastDotId: number) {
    this.renderer2.removeClass(this.dotsElementsArray[lastDotId], 'active')
    this.renderer2.addClass(this.dotsElementsArray[newDotId], 'active')
    this.pointIdEmitter.emit(newDotId)
  }
}
