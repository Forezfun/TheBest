import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { PublicationControlService } from '../../services/publication-control.service';
import { interfaceServerPublicationInformation } from '../../services/publication-control.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-publication-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor, NgxSpinnerModule],
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent implements AfterViewInit {
  constructor(
    private publicationControlService: PublicationControlService,
    private router: Router,
    private elementOfComponent: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) { }
  PopularCardsArray: interfaceServerPublicationInformation[] = []
  finderInputElement!: HTMLInputElement
  ngAfterViewInit(): void {
    this.finderInputElement = this.elementOfComponent.nativeElement.querySelector('.inputFinder') as HTMLInputElement;
    this.findPublications()
  }
  findPublications() {
    this.spinner.show()
    this.publicationControlService.GETgetAllPublications(this.finderInputElement.value)
      .subscribe({
        next:(resolve) => {
          this.PopularCardsArray = [];
          (resolve as interfaceServerPublicationInformation[]).forEach(publication => {
            this.PopularCardsArray = [...this.PopularCardsArray, publication]
          })
          this.spinner.hide()
          this.changeDetectorRef.detectChanges()
        },
        error:(error) => { 
          console.log(error)
          this.spinner.hide()
         }
  })
  }
openPublication(idPublication: string) {
  this.router.navigateByUrl(`/publication/${idPublication}`)
}
}
