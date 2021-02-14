import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { CookieService } from 'services/cookie-service';
import { RegistrationService } from 'registration/registration-service';

@autoinject()
export class CompleteRegistration {

  private user: any;

  public password: string;
  public confirmPassword: string;

  private token: string;

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
      this.token = params.token;
      console.log(' ::><> token = ', this.token);
    } catch(e) {
      console.warn(' ::>> Failed to parse registration data.');
    }
  }

  public completeRegistration(): void {
    this.registrationService
      .completeRegistration(
        this.token,
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
