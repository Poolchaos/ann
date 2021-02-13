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
      { route: ['', 'home'],   name: 'home',         moduleId: PLATFORM.moduleName('home/home')                                                   },
      { route: 'login',        name: 'login',        moduleId: PLATFORM.moduleName('login/login'),               nav: true, title: 'Login'        },
      { route: 'registration', name: 'registration', moduleId: PLATFORM.moduleName('registration/registration'), nav: true, title: 'Registration' },
      { route: 'dashboard',    name: 'dashboard',    moduleId: PLATFORM.moduleName('dashboard/dashboard'),       nav: true, title: 'Dashboard'    },
    ]);
    this.router = router;
  }

  public activate(): void {
    this.retrieveUsers();
  }

  public saveUser(): void {
    this.httpClient.createRequest('http://localhost:3000/users')
      .asPost()
      .withContent({  })
      .send()
      .then(
        (response) => {
          console.log(' ::>> response ', response);
        },
        (error) => {
          console.warn(' ::>> error ', error);
        }
      );
  }

  private retrieveUsers(): void {
    this.httpClient.createRequest('http://localhost:3000/users')
      .asGet()
      .withParams({})
      .send()
      .then(
        (response) => {
          console.log(' ::>> response ', response);
        },
        (error) => {
          console.warn(' ::>> error ', error);
        }
      );
  }

  public register(): void {
    
    var user = {
      firstName: "phillip-juan",
      surname: "van der Berg",
      email: "bt1phillip@gmail.com",
      contactNumbers: ["0712569431"]
    };

    this.httpClient.createRequest('http://localhost:3000/passport/submit')
      .asPost()
      .withContent(user)
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
      .send()
      .then(
        (response) => {
          console.log(' ::>> response ', response);
        },
        (error) => {
          console.warn(' ::>> error ', error);
        }
      );
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
