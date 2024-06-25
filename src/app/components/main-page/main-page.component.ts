import { Component,Renderer2, OnDestroy, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { DotsBarComponent } from '../dots-bar/dots-bar.component';
interface properties {
  Name: string;
  Ram: number;
  Acc: number;
  Cam: number;
  Photo: string;
}
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NavigationPanelComponent,DotsBarComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent  {
  constructor(private render:Renderer2){}
  @ViewChild(DotsBarComponent) dotsBar!: DotsBarComponent;
  @ViewChild('informationCard') informationCard!: ElementRef;
  currentIphoneId:number=0;
  dotsArrayCheck:string[]=['10','11','12','13','14','15']
  informationExampleArray: properties[] = [
    { Name: "iPhone 10", Ram: 3, Acc: 2716, Cam: 12, Photo: "iphone10.png" },
    { Name: "iPhone 11", Ram: 4, Acc: 3110, Cam: 12, Photo: "iphone11.png" },
    { Name: "iPhone 12", Ram: 4, Acc: 2815, Cam: 12, Photo: "iphone12.png" },
    { Name: "iPhone 13", Ram: 6, Acc: 3095, Cam: 12, Photo: "iphone13.png" },
    { Name: "iPhone 14", Ram: 6, Acc: 3095, Cam: 12, Photo: "iphone14.png" },
    { Name: "iPhone 15", Ram: 8, Acc: 3095, Cam: 12, Photo: "iphone15.png" }
  ]
  changeIphoneId(id:number){
    this.render.addClass(this.informationCard.nativeElement,'opacityAnimation')
    setTimeout(()=>{this.currentIphoneId=id},525)
    setTimeout(()=>{this.render.removeClass(this.informationCard.nativeElement,'opacityAnimation')},800)
  }
}
