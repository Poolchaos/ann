import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { CookieService } from 'services/cookie-service';
import { RegistrationService } from 'registration/registration-service';

@autoinject()
export class CompleteRegistration {

  private user: any;

  public password: string;
  public confirmPassword: string;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private registrationService: RegistrationService
  ) {
    console.log(' ::>> CompleteRegistration ');
  }

  public activate(params: {[key: string]: string}): void {
    console.log(' ::>> params >>>> ', params);
    try {
      this.user = JSON.parse(this.cookieService.getCookie('ann-registration'));
      console.log(' ::><> user = ', this.user);
    } catch(e) {
      console.warn(' ::>> Failed to parse registration data.');
    }
  }

  public completeRegistration(): void {
    this.registrationService
      .completeRegistration(
        this.user,
        this.password
      )
      .then(() => {
        console.log(' ::>> registration Complete >>> navigating to login');
        this.cookieService.eraseCookie('ann-registration');
        this.router.navigate('login');
      })
      .catch(() => {
        this.router.navigate('login');
      });
  }
}
