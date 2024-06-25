import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
interface popularCard {
  title: string;
  description: string;
  subDescription: string;
  imgLink: string;
}
@Component({
  selector: 'app-popular-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor],
  templateUrl: './popular-page.component.html',
  styleUrl: './popular-page.component.scss'
})
export class PopularPageComponent {
  exampleCardsArray: popularCard[] = [
    {
      title: 'Iphone',
      description: 'история самого продаваемого телефона в истории',
      subDescription: 'от 7 iphone до последней модели',
      imgLink: 'iphone15.png'
    },
    {
      title: 'Windows',
      description: 'Самая популярная операционная система в мире',
      subDescription: 'на ней сидишь даже ты',
      imgLink: 'windows.png'
    }
  ]
  findPublications() { }
}
