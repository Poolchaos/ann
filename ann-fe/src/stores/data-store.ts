import { autoinject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CookieService } from 'services/cookie-service';
import { EVENTS } from './events';
import { CartModel, ICartItem } from './cart-model';

@autoinject()
export class DataStore {

  private USER: ILogin | IUser;
  public cart: CartModel = new CartModel();

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
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_IN, (data: ILogin) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_REHYDRATE, (data: IUser) => this.user = data);
    this.eventAggregator.subscribe(EVENTS.USER_LOGGED_OUT, (data: IUser) => this.user = data);
    
    this.eventAggregator.subscribe(EVENTS.ADD_ITEM_TO_CART, (item: ICartItem) => this.cart.add(item));
    this.eventAggregator.subscribe(EVENTS.REMOVE_ITEM_FROM_CART, (itemId: string) => this.cart.remove(itemId));
    this.eventAggregator.subscribe(EVENTS.CLEAR_CART, () => this.cart.clear());
  }

  public set user(user: ILogin | IUser) {
    this.USER = user;
    if (user) {
      this.cookieService.setCookie(EVENTS.CACHE.USER, JSON.stringify(user), 3);
    } else {
      this.cookieService.eraseCookie(EVENTS.CACHE.USER);
    }
    this.dataUpdated(EVENTS.USER_UPDATED);
  }

  @computedFrom('USER')
  public get user(): ILogin | IUser {
    return this.USER;
  }

  @computedFrom('USER.role')
  public get isAdmin(): boolean {
    return this.USER ? this.USER.role === EVENTS.ROLES.ADMIN : false;
  }

  @computedFrom('USER.role')
  public get isJournalist(): boolean {
    return this.USER ? this.USER.role === EVENTS.ROLES.JOURNALIST : false;
  }

  @computedFrom('USER.role')
  public get isVoiceOver(): boolean {
    return this.USER ? this.USER.role === EVENTS.ROLES.VOICE_OVER : false;
  }

  @computedFrom('USER.role')
  public get isUser(): boolean {
    return this.USER ? this.USER.role === EVENTS.ROLES.USER : false;
  }
}

export interface ILogin {
  _id: string;
  token: string;
  role: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  token: string;
  number: string;
  role: string;
  permissions: boolean;
}