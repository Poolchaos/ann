import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { DataStore } from 'stores/data-store';
import { PurchaseService } from 'features/default_user/purchases/purchase-service';
import { EVENTS } from 'stores/events';

@autoinject()
export class Cart {

  private purchases: [] = [];

  constructor(
    public dataStore: DataStore,
    private purchaseService: PurchaseService
  ) {}

  public activate(): void {
    this.retrievePurchases();
  }

  public retrievePurchases(): void {

    this.purchaseService
      .getPurchases()
      .then((purchases) => {
        console.log(' ::>> successfully activated article ');
        this.purchases = purchases;
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
      });
  }

}