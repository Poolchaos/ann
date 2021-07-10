import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { EVENTS } from 'stores/events';
import { AuthenticateService } from 'login/authenticate-service';

@autoinject()
export class Unauthorised {

  constructor(
    private eventAggregator: EventAggregator,
    private router: Router,
    private authenticateService: AuthenticateService
  ) {}

  // check unauthorised styling
  public logout(): void {
    this.eventAggregator.publish(EVENTS.USER_LOGGED_OUT);
    this.router.navigate('');
    this.authenticateService.logout();
  }
}