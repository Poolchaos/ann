import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

import { EVENTS } from 'stores/events';
import { LoginService } from "./login-service";

@autoinject()
export class Login {

  public email: string;
  public password: string;

  private fromRoute: string;

  constructor(
    private router: Router,
    private eventAggregator: EventAggregator,
    private loginService: LoginService
  ) {
    console.log(' ::>> Login ');
  }

  public activate(params: { from: string }): void {
    this.fromRoute = params.from;
  }

  public login(): void {
    console.log(' ::>> login clicked ');

    this.loginService
      .authenticate(this.email, this.password)
      .then(user => {
        this.eventAggregator.publish(EVENTS.USER_LOGGED_IN, user);

        if (this.fromRoute) {
          this.router.navigate(this.fromRoute);
        } else {
          this.router.navigate('dashboard');
        }

      })
      .catch(error => {
        console.warn('Failed to login due to cause', error);
      });
  }
}