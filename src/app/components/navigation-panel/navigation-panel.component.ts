import { Component } from '@angular/core';
import { UserControlService } from '../../services/user-control.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation-panel',
  standalone: true,
  imports: [],
  providers:[UserControlService],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.scss'
})
export class NavigationPanelComponent {
constructor(private userControlService:UserControlService,private router:Router){}
checkUserLogined(){
  if(this.userControlService.getUserAccountInCookies()){this.router.navigate(['/account']);return}
  this.router.navigate(['/login']);
}
}
