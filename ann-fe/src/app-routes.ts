import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class AppRoutes {

  constructor() {
  }

  public static get routes(): RouteConfig[] {
    return this.errorRoutes().concat(this.loginRoutes(), this.registrationRoutes(), this.appRoutes(), this.authRoutes());
  }

  private static loginRoutes(): RouteConfig[] {
    return [{
      route: 'login',
      name: 'login',
      moduleId: PLATFORM.moduleName('login/login'),
      nav: true,
      title: 'Login',
      auth: false
    }
    // todo: add forgot password
    ];
  }

  private static registrationRoutes(): RouteConfig[] {
    return [{
      route: 'registration',
      name: 'registration',
      moduleId: PLATFORM.moduleName('registration/registration'),
      nav: true,
      title: 'Registration',
      auth: false
    },{
      route: 'email-sent',
      name: 'email-sent',
      moduleId: PLATFORM.moduleName('registration/email-sent/email-sent'),
      nav: true,
      title: 'email-sent',
      auth: false
    }, {
      route: 'registration-complete',
      name: 'registration-complete',
      moduleId: PLATFORM.moduleName('registration/registration-complete/registration-complete'),
      nav: true,
      title: 'Registration Complete',
      auth: false
    }, {
      route: 'complete-registration',
      name: 'complete-registration',
      moduleId: PLATFORM.moduleName('registration/complete-registration/complete-registration'),
      nav: true,
      title: 'Complete Registration',
      auth: false
    }];
  }

  private static appRoutes(): RouteConfig[] {
    return [{
      route: ['', 'home'],
      name: 'home',
      moduleId: PLATFORM.moduleName('home/home'),
      nav: true,
      title: 'Home',
      auth: false
    }];
  }

  private static authRoutes(): RouteConfig[] {
    return [{
      route: 'dashboard',
      name: 'dashboard',
      moduleId: PLATFORM.moduleName('dashboard/dashboard'),
      nav: true,
      title: 'Dashboard',
      auth: true,
      settings: {
        access: ['DEFAULT_USER', 'Admin', 'Journalist', 'Voice-Over']
      }
    }];
  }

  private static errorRoutes(): RouteConfig[] {
    return [{
      route: 'error',
      name: 'error',
      moduleId: PLATFORM.moduleName('error/error'),
      nav: false,
      title: 'Error',
      auth: false
    }];
  }
}