import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MsalGuard } from '@azure/msal-angular';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: "profile", 
        component: ProfileComponent,
        canActivate: [
            MsalGuard
        ] // if true then allows to go there otherwise redirect
    },
    {
        path: "**", 
        component: HomeComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {}