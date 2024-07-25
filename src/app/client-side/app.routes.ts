import { Routes} from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PublicationPageComponent } from './components/publication-page/publication-page/publication-page.component';
import { CreatePageComponent } from './components/create-page/create-page.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { TopPageComponent } from './components/top-page/top-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page/not-found-page.component';
export const routes: Routes = [
    {path:'',component:MainPageComponent},
    {path:'login',component:LoginPageComponent},
    {path:'top',component:TopPageComponent},
    {path:'create/:id',component:CreatePageComponent},
    {path:'account',component:AccountPageComponent},
    {path:'publication/:id',component:PublicationPageComponent},
    {path:'**',component:NotFoundPageComponent},
];
