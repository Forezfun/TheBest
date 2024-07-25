import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PublicationControlService } from './services/publication-control.service';
import { UserControlService } from './services/user-control.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:true,
  imports:[RouterModule,HttpClientModule],
  providers:[PublicationControlService,UserControlService]
})
export class AppComponent {
  title = 'TheBest';
}
