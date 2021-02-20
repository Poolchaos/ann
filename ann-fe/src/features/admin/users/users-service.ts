import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { DataStore, IUser } from 'stores/data-store';

@autoinject()
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private dataStore: DataStore
  ) {}
  
  public retrieveUsers(): Promise<IUser[]> {
    return new Promise(resolve => {
      this.httpClient.createRequest('users')
        .asGet()
        .send()
        .then(
          (response) => {
            // @ts-ignore
            resolve(response);
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
  public removeUser(userId: string): Promise<void> {
    return new Promise(resolve => {
      this.httpClient.createRequest('users')
        .asDelete()
        .withContent({ userId })
        .send()
        .then(
          () => {
            console.log(' ::>> successfully removed member ');
            resolve();
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
  public enableAccess(userId: string): Promise<void> {
    return new Promise(resolve => {
      // todo: abstract all routes
      this.httpClient.createRequest('users/enable')
        .asPut()
        .withContent({ userId })
        .send()
        .then(
          () => {
            console.log(' ::>> successfully removed member ');
            resolve();
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
}