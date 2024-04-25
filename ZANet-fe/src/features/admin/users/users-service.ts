import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { DataStore, IUser } from 'stores/data-store';

@autoinject()
export class UserService {

  private route = 'users';

  constructor(
    private httpClient: HttpClient,
    private dataStore: DataStore
  ) {}
  
  public retrieveUsers(): Promise<any> {
    return this.httpClient.createRequest(this.route)
      .asGet()
      .send()
      .catch((error) => {
          console.warn(' ::>> error ', error);
        }
      );
  }
  
  public removeUser(userId: string): Promise<void> {
    return new Promise(resolve => {
      this.httpClient.createRequest(this.route)
        .asDelete()
        .withContent({ userId })
        .send()
        .then(() => resolve())
        .catch((error) => {
          console.warn(' ::>> error ', error);
        });
    });
  }
  
  public enableAccess(userId: string): Promise<any> {
    return this.httpClient.createRequest(this.route + '/enable')
      .asPut()
      .withContent({ userId })
      .send();
  }
  
  public disableAccess(userId: string): Promise<any> {
    return this.httpClient.createRequest(this.route + '/disable')
      .asPut()
      .withContent({ userId })
      .send();
  }
}
