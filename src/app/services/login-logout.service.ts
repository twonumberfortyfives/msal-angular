import { Inject, Injectable } from "@angular/core";
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from "@azure/msal-angular";
import { RedirectRequest } from "@azure/msal-browser";

@Injectable({
    providedIn: "root"
})
export class LoginLogoutServiceMSAL {
    constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
        private authService: MsalService
    ) {}

    login() {
        if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect(
                { ...this.msalGuardConfig.authRequest } as RedirectRequest
            )
        } else {
            this.authService.loginRedirect()
        }
    }
    
    logout() {
        this.authService.logoutRedirect()
    }
}