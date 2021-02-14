import { autoinject, computedFrom } from 'aurelia-framework';
import { Router, NavigationInstruction, Next, RedirectToRoute, Redirect, RouteConfig } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';

import { DataStore, IUser } from 'stores/data-store';
import { EVENTS } from 'stores/events';
import { AppRoutes } from 'app-routes';
import { CookieService } from 'services/cookie-service';

@autoinject()
export class App {
  
  public locales: any;
  public currentLocale: any;

  constructor(
    private router: Router,
    private dataStore: DataStore,
    private eventAggregator: EventAggregator,
    private i18n: I18N
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
    this.currentLocale = this.i18n.getLocale();

    console.log(' ::>> this.currentLocale >>>> ', this.currentLocale);
  }

  public configureRouter(config, router): void {
    config.title = 'ANN';
    config.options.pushState = true;
    config.addPipelineStep('authorize', AuthStep);
    let routeConfigs: RouteConfig[] = AppRoutes.routes;
    config.map(routeConfigs);
    this.router = router;
  }

  public setLocale(locale: { code: string }): void {
    let code = locale.code
    if(this.currentLocale !== code) {
      this.i18n.setLocale(code);
      this.currentLocale = code;
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
class AuthStep {
  private showLoader: boolean;

  constructor(
    private dataStore: DataStore,
    private cookieService: CookieService
  ) {}

  run(navigationInstruction: NavigationInstruction, next: Next): any {

    const cookie = this.cookieService.getCookie('ann-user');
    const user: IUser = cookie ? JSON.parse(cookie) : null;
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