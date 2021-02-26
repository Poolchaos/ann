import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { DataStore } from 'stores/data-store';
import { PurchaseService } from 'features/default_user/purchases/purchase-service';
import { EVENTS } from 'stores/events';

@autoinject()
export class Cart {

  public error: boolean;

  constructor(
    public dataStore: DataStore,
    private purchaseService: PurchaseService,
    private eventAggregator: EventAggregator,
    private router: Router
  ) {}

  public checkout(): void {

    this.error = false;
    if (!this.dataStore.cart.hasItems) return;
    const articleIds = this.dataStore.cart.checkout();

    this.purchaseService
      .checkout(articleIds)
      .then(() => {
        this.router.navigate('checkout-complete');
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
        this.error = true;
      });
  }

  public remove(itemId: string): void {
    this.eventAggregator.publish(EVENTS.REMOVE_ITEM_FROM_CART, itemId);
  }
}