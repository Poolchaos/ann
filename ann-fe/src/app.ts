import { autoinject, computedFrom } from 'aurelia-framework';
import { Router, NavigationInstruction, Next, RedirectToRoute, Redirect, RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

import { DataStore, IUser } from 'stores/data-store';
import { EventAggregator } from 'aurelia-event-aggregator';
import { EVENTS } from 'stores/events';
import { AppRoutes } from 'app-routes';

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
    config.addPipelineStep('authorize', AuthStep);
    let routeConfigs: RouteConfig[] = AppRoutes.routes;
    config.map(routeConfigs);
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

@autoinject()
class AuthStep {
  private showLoader: boolean;

  constructor(private dataStore: DataStore, private eventAggregator: EventAggregator) {
  }

  run(navigationInstruction: NavigationInstruction, next: Next): any {

    const user: IUser = this.dataStore.user;
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

    if (access && user && user.roles) {
      let hasAccess = false;
      const roles = user.roles;

      for (let role of access) {
        for (let item of roles) {
          if (role === item) {
            hasAccess = true;
          }
        }
      }
      if (!hasAccess) {
        return next.cancel(new Redirect('/error/2'));
      }
    }

    return next();
  }
}