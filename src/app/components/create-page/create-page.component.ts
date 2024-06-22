import { Component } from '@angular/core';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [NavigationPanelComponent],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss'
})
export class CreatePageComponent {

}
