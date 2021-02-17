import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject()
export class PurchaseService {

  private route: string = 'purchases';

  constructor(private httpClient: HttpClient) {}

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
}
