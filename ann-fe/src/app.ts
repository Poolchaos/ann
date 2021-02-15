import { autoinject, computedFrom } from 'aurelia-framework';
import { Router, NavigationInstruction, Next, RedirectToRoute, Redirect, RouteConfig } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';

import { DataStore, IUser } from 'stores/data-store';
import { EVENTS } from 'stores/events';
import { AppRoutes } from 'app-routes';
import { CookieService } from 'services/cookie-service';

import './includes';
import { EventsStore } from 'stores/events-store';

@autoinject()
export class App {
  
  public locales: any;
  public currentLocale: any;

  constructor(
    private router: Router,
    private dataStore: DataStore,
    private eventAggregator: EventAggregator,
    private cookieService: CookieService,
    private i18n: I18N,
    private eventsStore: EventsStore
  ) {
    this.locales = [
      { title: "Afrikaans", code: "af" },
      { title: "English", code: "en" },
      { title: "isiNdebele", code: "nr" },
      { title: "isiXhosa", code: "xh" },
      { title: "isiZulu", code: "zu" },
      { title: "Sesotho", code: "st" },
      { title: "Sepedi", code: "nso" },
      { title: "Setswana", code: "tn" },
      { title: "siSwati", code: "ss" },
      { title: "Tshivenda", code: "ve" },
      { title: "Xitsonga", code: "ts" }
    ];
    const code = this.cookieService.getCookie('ann-locale');
    if (code) {
      this.setLocale({ code });
    } else {
      this.currentLocale = this.i18n.getLocale();
    }
  }

  public configureRouter(config, router): void {
    console.log(' ::>> configROuter');
    config.title = 'ANN';
    config.options.pushState = true;
    config.addPipelineStep('authorize', AuthStep);
    let routeConfigs: RouteConfig[] = AppRoutes.routes;
    config.map(routeConfigs);
    this.router = router;
  }

  public activate(): void {
    this.init();
  }

  private init(): void {
    try {
      let user = JSON.parse(this.cookieService.getCookie('ann-user'));
      if (!user || user === 'null') {
        return;
      }

      this.eventsStore
      .subscribeAndPublish(
        EVENTS.USER_LOGGED_IN,
        EVENTS.USER_UPDATED,
        user,
        () => this.userValidated()
      );
    } catch(e) {}
  }

  private userValidated(): void {


    const currentInstruction = location.href.split('/');
    const routeName = currentInstruction[currentInstruction.length - 1];
    const anonymousRoutes = ['login', 'registration', 'complete-registration', 'registration-complete', 'email-sent'];

    if (anonymousRoutes.includes(routeName)) {
      this.router.navigate('dashboard');
      location.href = location.href.replace(routeName, 'dashboard');
    }
  }

  public setLocale(locale: { code: string }): void {
    let code = locale.code
    if(this.currentLocale !== code) {
      this.i18n.setLocale(code);
      this.currentLocale = code;
      this.cookieService.setCookie('ann-locale', code);
    }
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

@autoinject()
export class AuthStep {
  private showLoader: boolean;

  constructor(
    private dataStore: DataStore,
    private cookieService: CookieService
  ) {}

  run(navigationInstruction: NavigationInstruction, next: Next): any {
    console.log(' ::>> navigationInstruction >>>>> ');

    const cookie = this.cookieService.getCookie('ann-user');
    const user: IUser = cookie ? JSON.parse(cookie) : null;
    console.log(' :>> user ==== ', user);
    /*AUTH*/
    let isAuthRoute: boolean = navigationInstruction.getAllInstructions().some(i => i.config.auth);
    if (isAuthRoute) {
      if (!user) {
        return next.cancel(new RedirectToRoute('login', { from: `${document.location.pathname}${document.location.search}` }));
      }
    }

    /*BLOCKED*/
    let isBlocked: boolean = navigationInstruction.getAllInstructions().some(i => i.config.isBlocked);
    if (isBlocked) {
      return next.cancel(new Redirect('/error/1'));
    }

    /*AUTHORISED*/
    let allInstructions: NavigationInstruction[] = navigationInstruction.getAllInstructions();
    let nextInstruction: NavigationInstruction = allInstructions[1];
    let access: any = nextInstruction ? nextInstruction.config.settings.access || nextInstruction.config.settings : null;
    
    console.log(' ::>> role check ', user, access);
    if (access && user && user.role) {
      let hasAccess = false;

      for (let role of access) {
        if (role === user.role) {
          hasAccess = true;
        }
      }
      if (!hasAccess) {
        return next.cancel(new Redirect('/error/2'));
      }
    }

    return next();
  }
}