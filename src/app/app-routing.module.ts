import { Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    {path: "", component: AppComponent},
    {path: "home", component: HomeComponent},
    {path: "profile", component: ProfileComponent}
];
