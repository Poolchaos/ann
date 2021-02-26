import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { DataStore } from 'stores/data-store';

@autoinject()
export class PurchaseService {

  private route: string = 'purchases';

  constructor(
    private httpClient: HttpClient,
    private dataStore: DataStore
  ) {}

  public checkout(articles: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.createRequest(this.route + '/checkout')
        .asPost()
        .withContent(articles)
        .send()
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  public getPurchases(): Promise<any> {
    if (this.dataStore.isAdmin) {
      return this.retrieveAllPurchases();
    } else if (this.dataStore.isUser) {
      return this.retrievePurchases();
    }
  }

  public retrieveAllPurchases(): Promise<any> {
    return this.httpClient.createRequest(this.route + '/all')
      .asGet()
      .send();
  }

  public retrievePurchases(): Promise<any> {
    return this.httpClient.createRequest(this.route)
      .asGet()
      .send();
  }
}
