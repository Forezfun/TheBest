import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationPanelComponent } from '../../navigation-panel/navigation-panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationControlService } from '../../../services/publication-control.service';
import { interfaceServerPublicationInformation, interfacePageInformation } from '../../../services/publication-control.service';
import { DotsBarComponent } from '../../dots-bar/dots-bar.component';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { EditorComponent } from '@tinymce/tinymce-angular';
@Component({
  selector: 'app-publication-page',
  standalone: true,
  imports: [NavigationPanelComponent, DotsBarComponent, NgIf, CommonModule, EditorComponent],
  templateUrl: './publication-page.component.html',
  styleUrl: './publication-page.component.scss'
})
export class PublicationPageComponent implements OnInit {
  constructor(
    private routerObservable: ActivatedRoute,
    private publicationControlService: PublicationControlService,
    private router: Router
  ) { }
  @ViewChild('tinyEditor') tinyEditor!: EditorComponent;
  pagesIdArray$?: Observable<interfacePageInformation[]>;

  editorApiKey = "pa2wb6quye1a8vzzmn5v79fq0iwcr78l02u3tohb4401tufu"
  editorInitObject: EditorComponent['init'] = {
    selector: 'textarea',
    resize: 'both',
    plugins: 'fullscreen ',
    toolbar: 'fullscreen',
    height: '65vh',
    menu: {
      file: { title: '', items: '' },
      view: { title: '', items: '' },
      table: { title: '', items: '' },
      insert: { title: '', items: '' },
      edit: { title: '', items: '' },
      format: { title: '', items: '' }
    },
    setup: (editor) => {
      editor.on('keydown', (event) => {
        event.preventDefault();
      })
      editor.on('init', () => {
        this.changePage(0);
      });
    }
  }
  ngOnInit(): void {
    this.routerObservable.paramMap.subscribe(params => {
      const idPublication = params.get('id')
      if (!idPublication) {
        this.router.navigateByUrl('/**');
        return;
      }
      this.publicationControlService.GETgetPublication(idPublication)
        .subscribe(
          resolve => {
            const SERVER_PUBLICATION_DATA_OBJECT: interfaceServerPublicationInformation = resolve as interfaceServerPublicationInformation
            this.pagesIdArray$ = of(SERVER_PUBLICATION_DATA_OBJECT.nameAddModulesArray)
          },
          error => {
            console.log(error)
            this.router.navigateByUrl('/**')
            return
          }
        )
    })
  }
  async changePage(pageId: number) {
    const pagesIdArray: interfacePageInformation[] = await firstValueFrom(this.pagesIdArray$!) as interfacePageInformation[]
    this.tinyEditor.editor.setContent(pagesIdArray[pageId].codePage)
  }
}
