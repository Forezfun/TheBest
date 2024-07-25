import { Component, Input, Output, EventEmitter, AfterViewInit, Renderer2, OnDestroy, ElementRef,PLATFORM_ID, Inject } from '@angular/core';
import { NgFor, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-dots-bar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dots-bar.component.html',
  styleUrl: './dots-bar.component.scss'
})
export class DotsBarComponent implements AfterViewInit, OnDestroy {
  constructor(private renderer2: Renderer2,private elementOfComponent:ElementRef,@Inject(PLATFORM_ID) private platformId: Object) { }
  @Input() dotsArray!: string[]
  @Output() iphoneIdEmitter = new EventEmitter<number>();
  private currentDotId: number = 0;
  private timerChangeIphoneInformation!: any
  private dotsElementsArray!: NodeListOf<Element>

  ngAfterViewInit(): void {
    this.dotsElementsArray = this.elementOfComponent.nativeElement.querySelectorAll('.dot')
    this.dotsElementsArray[0].classList.add('active')
    this.setTimerChanges()
  }
  ngOnDestroy(): void {
    clearInterval(this.timerChangeIphoneInformation)
  }
  
  setTimerChanges(){
    if (!isPlatformBrowser(this.platformId))return
    this.timerChangeIphoneInformation = window.setInterval(() => {
      const lastDotId = this.currentDotId
      this.currentDotId < this.dotsArray.length - 1 ? this.currentDotId++ : this.currentDotId = 0
      this.changeActiveDot(this.currentDotId, lastDotId)
    }, 5000)
  }
  chooseDot(event: any) {
    clearInterval(this.timerChangeIphoneInformation)
    console.log(event.target.querySelector('div'),event.target)
    const idChoosedDot = +event.target.querySelector('div').getAttribute('id')
    this.changeActiveDot(idChoosedDot, this.currentDotId)
    this.currentDotId = idChoosedDot
    this.setTimerChanges()
  }
  changeActiveDot(newDotId: number, lastDotId: number) {
    this.renderer2.removeClass(this.dotsElementsArray[lastDotId], 'active')
    this.renderer2.addClass(this.dotsElementsArray[newDotId], 'active')
    this.iphoneIdEmitter.emit(newDotId)
  }
}
