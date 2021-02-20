import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { DataStore } from 'stores/data-store';
import { PurchaseService } from 'features/admin/purchases/purchase-service';
import { EVENTS } from 'stores/events';

@autoinject()
export class Cart {
  constructor(
    public dataStore: DataStore,
    private purchaseService: PurchaseService,
    private eventAggregator: EventAggregator,
    private router: Router
  ) {}

  public checkout(): void {

    if (!this.dataStore.cart.hasItems) return;
    // todo: add validation

    // const articleIds = this.dataStore.cart.items.map(item => item._id);
    const articleIds = this.dataStore.cart.checkout();

    this.purchaseService
      .checkout(articleIds)
      .then(() => {
        console.log(' ::>> successfully activated article ');
        this.clear();
        this.router.navigate('purchases');
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
      });
  }

  public remove(itemId: string): void {
    this.eventAggregator.publish(EVENTS.REMOVE_ITEM_FROM_CART, itemId);
  }

  public clear(): void {
    if (!this.dataStore.cart.hasItems) return;
    this.eventAggregator.publish(EVENTS.CLEAR_CART);
  }
}