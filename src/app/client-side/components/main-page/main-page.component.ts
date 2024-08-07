import { Component, Renderer2 ,ViewChild, ElementRef} from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { DotsBarComponent } from '../dots-bar/dots-bar.component';
import { interfacePageInformation } from '../../services/publication-control.service';
interface interfaceIphoneInformation {
  Ram: number;
  Acc: number;
  Cam: number;
  Photo: string;
}
interface interfaceIphonesObject{
  [key:number]:interfaceIphoneInformation
}
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NavigationPanelComponent, DotsBarComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  @ViewChild('informationCard', { read: ElementRef }) private informationCard!: ElementRef;
  currentIphoneId: number=0
  informationIphonesExampleArray: interfaceIphonesObject = {
    10: { Ram: 3, Acc: 2716, Cam: 12, Photo: "iphone10.png" },
    11: { Ram: 4, Acc: 3110, Cam: 12, Photo: "iphone11.png" },
    12: { Ram: 4, Acc: 2815, Cam: 12, Photo: "iphone12.png" },
    13: { Ram: 6, Acc: 3095, Cam: 12, Photo: "iphone13.png" },
    14: { Ram: 6, Acc: 3095, Cam: 12, Photo: "iphone14.png" },
    15: { Ram: 8, Acc: 3095, Cam: 12, Photo: "iphone15.png" }
  };
  dotsNamesArray: interfacePageInformation[] = Object.keys(this.informationIphonesExampleArray).map(name=>{return {namePage:name,codePage:''}})

  constructor(
    private renderer2: Renderer2
  ) { }
  
  changeIphoneId(idIphone: number) {
    this.renderer2.addClass(this.informationCard.nativeElement, 'opacityAnimation')
    setTimeout(() => {
      this.currentIphoneId = idIphone
    }, 525)
    setTimeout(() => { this.renderer2.removeClass(this.informationCard.nativeElement, 'opacityAnimation') }, 800)
  }
}
