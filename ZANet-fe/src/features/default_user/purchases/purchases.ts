import { autoinject } from 'aurelia-framework';

import { DataStore } from 'stores/data-store';
import { PurchaseService } from 'features/default_user/purchases/purchase-service';

@autoinject()
export class Cart {

  public purchases: [] = [];

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