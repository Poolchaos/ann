import { autoinject, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

import { DataStore } from 'stores/data-store';
import { EventAggregator } from 'aurelia-event-aggregator';
import { EVENTS } from 'stores/events';

@autoinject()
export class App {

  constructor(
    private router: Router,
    private dataStore: DataStore,
    private eventAggregator: EventAggregator
  ) {}

  public configureRouter(config, router): void {
    config.title = 'ANN';
    config.options.pushState = true;
    config.map([
      { route: ['', 'home'],            name: 'home',                  moduleId: PLATFORM.moduleName('home/home')                                                                                           },
      { route: 'login',                 name: 'login',                 moduleId: PLATFORM.moduleName('login/login'),                                              nav: true, title: 'Login'                 },
      { route: 'registration',          name: 'registration',          moduleId: PLATFORM.moduleName('registration/registration'),                                nav: true, title: 'Registration'          },
      { route: 'email-sent',            name: 'email-sent',            moduleId: PLATFORM.moduleName('registration/email-sent/email-sent'),                       nav: true, title: 'email-sent'            },
      { route: 'registration-complete', name: 'registration-complete', moduleId: PLATFORM.moduleName('registration/registration-complete/registration-complete'), nav: true, title: 'Registration Complete' },
      { route: 'complete-registration', name: 'complete-registration', moduleId: PLATFORM.moduleName('registration/complete-registration/complete-registration'), nav: true, title: 'Complete Registration' },
      { route: 'dashboard',             name: 'dashboard',             moduleId: PLATFORM.moduleName('dashboard/dashboard'),                                      nav: true, title: 'Dashboard'             },
    ]);
    this.router = router;
  }

  public goToHome(): void {
    this.router.navigate('home');
  }

  public goToLogin(): void {
    this.router.navigate('login');
  }

  public goToRegistration(): void {
    this.router.navigate('registration');
  }

  public goToDashboard(): void {
    this.router.navigate('dashboard');
  }

  public logout(): void {
    this.eventAggregator.publish(EVENTS.USER_LOGGED_OUT);
    this.router.navigate('home');
  }

  @computedFrom('dataStore.user')
  public get isAuthenticated(): boolean {
    return !!this.dataStore.user;
  }
}
