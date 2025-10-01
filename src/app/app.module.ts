import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './components/posts/posts.component';
import { LoginLogoutServiceMSAL } from './services/login-logout.service';


// MSAL requirements
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { 
  IPublicClientApplication, 
  PublicClientApplication, 
  InteractionType, 
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';
import { 
  MsalGuard, 
  MsalInterceptor, 
  MsalBroadcastService, 
  MsalInterceptorConfiguration, 
  MsalModule, 
  MsalService, 
  MSAL_GUARD_CONFIG, 
  MSAL_INSTANCE, 
  MSAL_INTERCEPTOR_CONFIG, 
  MsalGuardConfiguration, 
  MsalRedirectComponent 
} from '@azure/msal-angular';


// checking what browser are we using
export const isIE = window.navigator.userAgent.indexOf("MSIE ") > 1 || 
  window.navigator.userAgent.indexOf("Trident/") > -1;

// creating msal instance with company credentials
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: "",
      authority: "",
      redirectUri: "http://localhost:4200/",
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE
    }
  })
}

// preparing settings for kind of like middleware or it is. Handles the state between client(browser) -> backend
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  // creating map -> kind of like python dict but key and values can be eveyrthing (not important to be hashable)
  const protectedResourceMap = new Map<string, Array<string>>()
  protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"])
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  }
}

// preparing settings for Guard
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ["user.read"]
    }
  }
}

@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent, 
    ProfileComponent, 
    PostsComponent
  ],
  imports: [
    BrowserModule, 
    MsalModule,
    CommonModule,
    AppRoutingModule,
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, // Angular token which contains chain of interceptors (middlewares) for all http requests
      useClass: MsalInterceptor, // create object of this class and use it in interceptors chain
      multi: true // we are not rewriting the prev. existing interceptors. We are adding created to the chain
    },
    {
      provide: MSAL_INSTANCE, // msal empty variable
      useFactory: MSALInstanceFactory // our func what returns object with attrs
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    LoginLogoutServiceMSAL
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
}
