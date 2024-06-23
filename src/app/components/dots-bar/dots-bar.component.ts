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
  constructor(private render: Renderer2,private el:ElementRef,@Inject(PLATFORM_ID) private platformId: Object) { }
  @Input() dotsArray!: string[]
  @Output() iphoneIdEmitter = new EventEmitter<number>();
  currentDotId: number = 0;
  timer!: any
  dotsElementsArray!: NodeListOf<Element>
  ngAfterViewInit(): void {
    this.dotsElementsArray = this.el.nativeElement.querySelectorAll('.dot')
    this.dotsElementsArray[0].classList.add('active')
    this.setTimerChanges()
  }
  ngOnDestroy(): void {
    clearInterval(this.timer)
  }
  setTimerChanges(){
    if (!isPlatformBrowser(this.platformId))return
    this.timer = window.setInterval(() => {
      const lastDotId = this.currentDotId
      this.currentDotId < this.dotsArray.length - 1 ? this.currentDotId++ : this.currentDotId = 0
      this.changeActiveDot(this.currentDotId, lastDotId)
    }, 5000)
  }
  chooseDot(event: any) {
    clearInterval(this.timer)
    console.log(event.target.querySelector('div'),event.target)
    const idChoosedDot = +event.target.querySelector('div').getAttribute('id')
    this.changeActiveDot(idChoosedDot, this.currentDotId)
    this.currentDotId = idChoosedDot
    this.setTimerChanges()
  }
  changeActiveDot(newDotId: number, lastDotId: number) {
    this.render.removeClass(this.dotsElementsArray[lastDotId], 'active')
    this.render.addClass(this.dotsElementsArray[newDotId], 'active')
    this.iphoneIdEmitter.emit(newDotId)
  }
}
