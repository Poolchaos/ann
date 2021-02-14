import { autoinject } from 'aurelia-framework';

import { DataStore, IUser } from 'stores/data-store';
import { CookieService } from 'services/cookie-service';
import { EventsStore } from 'stores/events-store';
import { EVENTS } from 'stores/events';
import { DashboardService } from './dashboard-service';

@autoinject()
export class Dashboard {

  public users: IUser[] = [];

  constructor(
    private dataStore: DataStore,
    private cookieService: CookieService,
    private eventsStore: EventsStore,
    private dashboardService: DashboardService
  ) {}

  public activate(): void {
    this.init();
  }

  private init(): void {
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

  private retrieveUsers(): void {
    this.dashboardService
      .retrieveUsers()
      .then((users: IUser[]) => {
        console.log(' ::>> data >>>> ', users);
        this.users = users;
      })
      .catch(() => {

      })
  }
}