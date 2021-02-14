import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { DataStore, IUser } from 'stores/data-store';

@autoinject()
export class DashboardService {

  constructor(
    private httpClient: HttpClient,
    private dataStore: DataStore
  ) {}
  
  public retrieveUsers(): Promise<IUser[]> {
    return new Promise(resolve => {
      this.httpClient.createRequest('http://localhost:3000/users')
        .asGet()
        .withParams({})
        .withHeader('Authorization', `Bearer ${this.dataStore.user.token}`)
        .send()
        .then(
          (response) => {
            try {
              const user = JSON.parse(response.response);
              resolve(user);
            } catch(e) {
              resolve(response.response);
            }
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
}