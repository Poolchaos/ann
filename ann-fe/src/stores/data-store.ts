import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CookieService } from 'services/cookie-service';
import { EVENTS } from './events';

@autoinject()
export class DataStore {

  private USER: IUser;

  constructor(
    private eventAggregator: EventAggregator,
    private cookieService: CookieService
  ) {
    this.initialiseSubscriptions();
  }

  private initialiseSubscriptions(): void {
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_IN, (data: IUser) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_OUT, (data: IUser) => this.user = data);
  }

  public set user(user: IUser) {
    console.log(' ::>> setting user >>>> ');
    this.USER = user;
    if (user) {
      this.cookieService.setCookie('ann-user', JSON.stringify(user), 3);
    } else {
      this.cookieService.eraseCookie('ann-user');
    }
  }

  @computedFrom('USER')
  public get user(): IUser {
    return this.USER;
  }
}

interface IUser {
  firstName: string;
  surname: string;
  email: string;
  token: string;
  number: string;
  roles: string[];
}