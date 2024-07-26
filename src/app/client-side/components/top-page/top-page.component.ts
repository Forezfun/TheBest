import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { PublicationControlService } from '../../services/publication-control.service';
import { interfaceServerPublicationInformation } from '../../services/publication-control.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-publication-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor],
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent implements OnInit{
  constructor(private publicationControlService:PublicationControlService,private router:Router){}
  PopularCardsArray: interfaceServerPublicationInformation[] = []
  ngOnInit(): void {
    this.findPublications()
  }
  findPublications() { 
    this.publicationControlService.GETgetAllPublications()
    .subscribe(
      resolve=>{
        console.log(resolve);
        (resolve as interfaceServerPublicationInformation[]).forEach(publication => {
          this.PopularCardsArray=[...this.PopularCardsArray,publication]
        })
      },
      error=>{console.log(error)}
    )
  }
  openPublication(idPublication:string){
    this.router.navigateByUrl(`/publication/${idPublication}`)
  }
}
