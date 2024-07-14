import { Routes} from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PopularPageComponent } from './components/popular-page/popular-page.component';
import { CreatePageComponent } from './components/create-page/create-page.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { PublicationPageComponent } from './components/publication-page/publication-page.component';
export const routes: Routes = [
    {path:'',component:MainPageComponent},
    {path:'login',component:LoginPageComponent},
    {path:'popular',component:PopularPageComponent},
    {path:'create',component:CreatePageComponent},
    {path:'account',component:AccountPageComponent},
    {path:'publication',component:PublicationPageComponent},
];
