import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PublicationControlService } from './services/publication-control.service';
import { UserControlService } from './services/user-control.service';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:true,
  imports:[RouterModule,HttpClientModule,NavigationPanelComponent],
  providers:[PublicationControlService,UserControlService]
})
export class AppComponent {
  title = 'TheBest';
}
