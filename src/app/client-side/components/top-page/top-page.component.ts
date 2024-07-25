import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { PublicationControlService } from '../../services/publication-control.service';
import { interfacePublicationInformation } from '../../services/publication-control.service';
@Component({
  selector: 'app-publication-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor],
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent implements OnInit{
  constructor(private publicationControlService:PublicationControlService){}
  PopularCardsArray: interfacePublicationInformation[] = []
  ngOnInit(): void {
    this.findPublications()
  }
  findPublications() { 
    this.publicationControlService.GETgetAllPublications()
    .subscribe(
      resolve=>{
        (resolve as interfacePublicationInformation[]).forEach(publication => {
          this.PopularCardsArray=[...this.PopularCardsArray,publication]
        })
      },
      error=>{console.log(error)}
    )
  }
}
