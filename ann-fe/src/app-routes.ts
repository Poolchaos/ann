import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class AppRoutes {

  constructor() {
  }

  public static get routes(): RouteConfig[] {
    return this.loginRoutes().concat(this.registrationRoutes(), this.appRoutes(), this.authRoutes())
  }

  
    // config.map([
    //   { route: ['', 'home'],            name: 'home',                  moduleId: PLATFORM.moduleName('home/home')                                                                                           },
    //   { route: 'login',                 name: 'login',                 moduleId: PLATFORM.moduleName('login/login'),                                              nav: true, title: 'Login'                 },
    //   { route: 'registration',          name: 'registration',          moduleId: PLATFORM.moduleName('registration/registration'),                                nav: true, title: 'Registration'          },
    //   { route: 'email-sent',            name: 'email-sent',            moduleId: PLATFORM.moduleName('registration/email-sent/email-sent'),                       nav: true, title: 'email-sent'            },
    //   { route: 'registration-complete', name: 'registration-complete', moduleId: PLATFORM.moduleName('registration/registration-complete/registration-complete'), nav: true, title: 'Registration Complete' },
    //   { route: 'complete-registration', name: 'complete-registration', moduleId: PLATFORM.moduleName('registration/complete-registration/complete-registration'), nav: true, title: 'Complete Registration' },
    //   { route: 'dashboard',             name: 'dashboard',             moduleId: PLATFORM.moduleName('dashboard/dashboard'),                                      nav: true, title: 'Dashboard'             },
    // ]);

  private static loginRoutes(): RouteConfig[] {
    return [{
      route: 'login',
      name: 'login',
      moduleId: PLATFORM.moduleName('login/login'),
      nav: true,
      title: 'Login',
      auth: false
    }
    // todo: add forpot password
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
      route: 'error/:code',
      name: 'error',
      moduleId: PLATFORM.moduleName('error/error'),
      nav: false,
      title: 'Error',
      auth: false
    }, {
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
    }, {
      route: 'articles',
      name: 'articles',
      moduleId: PLATFORM.moduleName('features/articles/articles'),
      nav: true,
      title: 'Articles',
      auth: false,
      settings: {
        access: ['Journalist']
      }
    }, {
      route: 'create-article',
      name: 'create-article',
      moduleId: PLATFORM.moduleName('features/articles/create-article/create-article'),
      nav: true,
      title: 'Create Article',
      auth: false,
      settings: {
        access: ['Journalist']
      }
    }];
  }
}