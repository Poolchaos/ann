import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

import { UserRegistrationSettings } from 'registration/user-registration-settings';

@autoinject()
export class App {
  public message = 'Hello World!';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {}

  public configureRouter(config, router): void {
    config.title = 'ANN';
    config.map([
      { route: ['', 'home'],            name: 'home',                  moduleId: PLATFORM.moduleName('home/home')                                                                                           },
      { route: 'login',                 name: 'login',                 moduleId: PLATFORM.moduleName('login/login'),                                              nav: true, title: 'Login'                 },
      { route: 'registration',          name: 'registration',          moduleId: PLATFORM.moduleName('registration/registration'),                                nav: true, title: 'Registration'          },
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
}
