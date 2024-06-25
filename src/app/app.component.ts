import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:true,
  imports:[RouterModule]
})
export class AppComponent {
  title = 'TheBest';
}
