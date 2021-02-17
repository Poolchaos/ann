import { autoinject, computedFrom } from 'aurelia-framework';

import { CookieService } from 'services/cookie-service';
import { EVENTS } from './events';

@autoinject()
export class CartModel {

  private cookieService = new CookieService();

  private _ITEMS: ICartItem[] = [];

  constructor() {
    this.getCookie();
  }

  public add(item: ICartItem) {
    if (!this.hasItem(item._id)) {
      this._ITEMS.push(item);
    }
    this.setCookie();
  }

  public remove(itemId: string): void {
    this._ITEMS = this._ITEMS.filter(item => item._id !== itemId);
    this.setCookie();
  }

  public clear(): void {
    this._ITEMS = [];
    this.removeCookie();
  }

  public checkout(): string[] {
    return this._ITEMS.map(item => item._id);
  }

  private setCookie(): void {
    this.cookieService.setCookie(EVENTS.CACHE.CART, JSON.stringify(this._ITEMS), 1);
  }

  private getCookie(): void {
    try {
      this._ITEMS = JSON.parse(this.cookieService.getCookie(EVENTS.CACHE.CART)) || [];
    } catch(e) {}
  }
  
  private removeCookie(): void {
    this.cookieService.eraseCookie(EVENTS.CACHE.CART);
  }

  @computedFrom('_ITEMS')
  public get hasItems(): boolean {
    return !!this._ITEMS.length;
  }
  @computedFrom('_ITEMS')
  public get items(): ICartItem[] {
    return [].concat(this._ITEMS);
  }

  @computedFrom('_ITEMS', '_ITEMS.length')
  public get itemsCount(): number {
    return this._ITEMS.length;
  }

  private hasItem(itemId: string): boolean {
    return !!this._ITEMS.find(item => item._id === itemId);
  }
}

export interface ICartItem {
  _id: string; // articleId
  name: string;
  category: string;
}