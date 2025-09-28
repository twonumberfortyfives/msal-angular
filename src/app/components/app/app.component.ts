import { Component } from '@angular/core';
import { isIE } from '../../app.module';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'msal-angular';

  constructor(){
    console.log(isIE)
    console.log(window.navigator.userAgent)
  }
}
