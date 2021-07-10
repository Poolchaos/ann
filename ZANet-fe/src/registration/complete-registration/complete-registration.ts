import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { CookieService } from 'services/cookie-service';
import { RegistrationService } from 'registration/registration-service';

@autoinject()
export class CompleteRegistration {

  public password: string;
  public confirmPassword: string;
  public resetComplete: boolean;

  private token: string;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private registrationService: RegistrationService
  ) {}

  public activate(params: {[key: string]: string}): void {
    if (params.token) {
      this.token = params.token;
    } else {
      this.resetComplete = true;
      setTimeout(() => {
        this.router.navigate('home');
      }, 3000);
    }
  }

  public completeRegistration(): void {
    this.registrationService
      .completeRegistration(
        this.token,
        this.password
      )
      .then(() => {
        console.log(' ::>> registration resetComplete >>> navigating to login');
        this.cookieService.eraseCookie('ZANet-registration');
        this.router.navigate('login');
      })
      .catch(() => {
        this.router.navigate('login');
      });
  }
}
