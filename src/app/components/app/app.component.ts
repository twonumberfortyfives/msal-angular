import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

// Required for MSAL
import { 
  MsalService, 
  MsalBroadcastService, 
  MSAL_GUARD_CONFIG, 
  MsalGuardConfiguration 
} from '@azure/msal-angular';
import { 
  EventMessage, 
  EventType, 
  InteractionStatus, 
  RedirectRequest 
} from '@azure/msal-browser';

// Required for RJXS
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy{ // OnInit calls once when componennt is initialized, OnDestroy when moving from 
  title = 'msal-angular';
  loginDisplay: boolean = false
  tokenExpiration: string = ''
  private readonly _destroying$ = new Subject<void>()

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ){}

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0
  }

  ngOnInit(): void {
    // connecting to pipeline filtering stream by status and subscribe only on None iteraction status. Follow the stream until instance attr _destroying$ is not changed.
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay()
      })
    // connecting to pipeline filtering stream and subscribe only on event type like successful token acquisition
    this.msalBroadcastService.msalSubject$.pipe(
      filter(
        (msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)
      ).subscribe(msg => {
        this.tokenExpiration = (msg.payload as any).expiresOn
    })
    localStorage.setItem("tokenExpiration", this.tokenExpiration)
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined)
    this._destroying$.complete()
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest)
    } else {
      this.authService.loginRedirect()
    }
  }

  logout() {
    this.authService.logoutRedirect()
  }

}
