import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { CookieService } from "services/cookie-service";
import { LoginService } from "./login-service";

@autoinject()
export class Login {

  public email: string;
  public password: string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private cookieService: CookieService
  ) {
    console.log(' ::>> Login ');
  }

  public login(): void {
    console.log(' ::>> login clicked ');

    this.loginService
      .authenticate(this.email, this.password)
      .then(user => {
        this.cookieService.setCookie('ann-user', JSON.stringify(user), 3);
        this.router.navigate('dashboard');
      })
      .catch(error => {
        console.warn('Failed to login due to cause', error);
      });
  }
}