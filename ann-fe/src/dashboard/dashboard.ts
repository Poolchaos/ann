import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { DataStore } from 'stores/data-store';
import { CookieService } from 'services/cookie-service';
import { EventsStore } from 'stores/events-store';
import { EVENTS } from 'stores/events';

@autoinject()
export class Dashboard {

  constructor(
    private dataStore: DataStore,
    private cookieService: CookieService,
    private eventsStore: EventsStore,
    private router: Router
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
    if (this.dataStore.isAdmin) {
      this.router.navigate('admin');
    } else if (this.dataStore.isJournalist) {
      this.router.navigate('articles');
    } else if (this.dataStore.isVoiceOver) {
      console.log(' ::>> is voice-over ');
    }
  }
}