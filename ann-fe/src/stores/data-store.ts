import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CookieService } from 'services/cookie-service';
import { EVENTS } from './events';

@autoinject()
export class DataStore {

  private static ROLES = {
    ADMIN: 'Admin',
    JOURNALIST: 'Joernalis',
    VOICE_OVER: 'Voice-Over'
  };
  private USER: IUser;

  constructor(
    private eventAggregator: EventAggregator,
    private cookieService: CookieService
  ) {
    this.initialiseSubscriptions();
  }

  private dataUpdated(event: string, data?: any): void {
    this.eventAggregator.publish(event, data);
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
    this.dataUpdated(EVENTS.USER_UPDATED);
  }

  @computedFrom('USER')
  public get user(): IUser {
    return this.USER;
  }

  @computedFrom('USER.roles')
  public get isAdmin(): boolean {
    return this.USER ? this.USER.role === DataStore.ROLES.ADMIN : false;
  }

  @computedFrom('USER.roles')
  public get isJournalist(): boolean {
    return this.USER ? this.USER.role === DataStore.ROLES.JOURNALIST : false;
  }

  @computedFrom('USER.roles')
  public get isVoiceOver(): boolean {
    return this.USER ? this.USER.role === DataStore.ROLES.VOICE_OVER : false;
  }
}

export interface IUser {
  firstName: string;
  surname: string;
  email: string;
  token: string;
  number: string;
  role: string;
}