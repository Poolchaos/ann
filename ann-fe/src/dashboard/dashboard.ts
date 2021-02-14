import { autoinject } from 'aurelia-framework';

import { DataStore } from 'stores/data-store';
import { CookieService } from 'services/cookie-service';
import { EventsStore } from 'stores/events-store';
import { EVENTS } from 'stores/events';

@autoinject()
export class Dashboard {

  constructor(
    private dataStore: DataStore,
    private cookieService: CookieService,
    private eventsStore: EventsStore
  ) {}

  public activate(): void {
    
    console.log(' ::>> loading dashboard');
    if (this.dataStore.user) {
      this.userValidated();
    } else {
      try {
        let user = JSON.parse(this.cookieService.getCookie('ann-user'));

        console.log(' ::>> user ');
        this.eventsStore
        .subscribeAndPublish(
          EVENTS.USER_LOGGED_IN,
          EVENTS.USER_UPDATED,
          user,
          () => this.userValidated()
        );

      } catch(e) {}
    }
  }

  private userValidated(): void {
    console.log(' ::>> userValidated this.dataStore ', this.dataStore.user);
    if (this.dataStore.isAdmin) {
      console.log(' ::>> is admin ');
    } else if (this.dataStore.isJournalist) {
      console.log(' ::>> is journalist ');
    } else if (this.dataStore.isVoiceOver) {
      console.log(' ::>> is voice-over ');
    }
  }

  // public saveUser(): void {
  //   this.httpClient.createRequest('http://localhost:3000/users')
  //     .asPost()
  //     .withContent({  })
  //     .send()
  //     .then(
  //       (response) => {
  //         console.log(' ::>> response ', response);
  //       },
  //       (error) => {
  //         console.warn(' ::>> error ', error);
  //       }
  //     );
  // }

  // private retrieveUsers(): void {
  //   this.httpClient.createRequest('http://localhost:3000/users')
  //     .asGet()
  //     .withParams({})
  //     .send()
  //     .then(
  //       (response) => {
  //         console.log(' ::>> response ', response);
  //       },
  //       (error) => {
  //         console.warn(' ::>> error ', error);
  //       }
  //     );
  // }
}