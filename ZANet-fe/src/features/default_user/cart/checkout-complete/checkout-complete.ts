import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ICartItem } from "stores/cart-model";
import { DataStore } from "stores/data-store";
import { EVENTS } from 'stores/events';

@autoinject()
export class CheckoutComplete {

  private items: ICartItem[] = [];

  constructor(
    private dataStore: DataStore,
    private eventAggregator: EventAggregator
  ) {}

  public activate(): void {
    this.getPurchasedItems();
  }

  private getPurchasedItems(): void {
    this.items = this.dataStore.cart.getItems();
    this.clear();
  }
  
  public clear(): void {
    if (!this.dataStore.cart.hasItems) return;
    this.eventAggregator.publish(EVENTS.CLEAR_CART);
  }
}