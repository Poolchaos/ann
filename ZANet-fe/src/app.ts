import { autoinject, computedFrom } from "aurelia-framework";
import {
  Router,
  NavigationInstruction,
  Next,
  RedirectToRoute,
  Redirect,
  RouteConfig,
} from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";

import { DataStore, IUser } from "stores/data-store";
import { EVENTS } from "stores/events";
import { AppRoutes } from "app-routes";
import { CookieService } from "services/cookie-service";
import { EventsStore } from "stores/events-store";
import { DashboardRoutes } from "dashboard/dashboard-routes";
import { AuthenticateService } from "login/authenticate-service";
import { ApplicationProperties } from "config/application.properties";
import HttpInterceptor from "config/http-interceptor";
import { SVGManager } from "./services/svg-manager-service";

import "./includes";

@autoinject()
export class App {
  public SVGManager = SVGManager;

  constructor(
    private router: Router,
    private dataStore: DataStore,
    private eventAggregator: EventAggregator,
    private cookieService: CookieService,
    private eventsStore: EventsStore,
    private authenticateService: AuthenticateService,
    private httpClient: HttpClient,
    private applicationProperties: ApplicationProperties
  ) {
    this.configureHTTP();
    this.init();
    // todo: add cookie permission
    console.log(
      " ::>> Intl.DateTimeFormat().resolvedOptions().timeZone >>>>> ",
      Intl.DateTimeFormat().resolvedOptions()
    );
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
    });
    const userLanguage = navigator.language.substring(0, 2);

    // // Using navigator.languages (preferred)
    // const languages = navigator.languages || [navigator.language];

    // // Accessing the most preferred language from the array
    // const primaryLanguage = languages[0];
    // console.log(" ::>> test >>>> ", primaryLanguage, userLanguage);

    // @ts-ignore
    const languageNames = new Intl.DisplayNames(["en"], {
      type: "language",
    });
    console.log(
      " ::>> language conversion >>>>> ",
      languageNames.of(userLanguage)
    );
  }

  public configureRouter(config, router): void {
    config.title = "ZANet";
    config.options.pushState = true;
    config.addPipelineStep("authorize", AuthStep);

    const routeConfigs: RouteConfig[] = [].concat(AppRoutes.routes);
    config.map(routeConfigs);
    this.router = router;
  }

  private configureHTTP(): void {
    console.log(
      " ::>> this.applicationProperties.apiQueryEndpoint >>>>> ",
      this.applicationProperties.apiQueryEndpoint
    );

    this.httpClient.configure((req) => {
      // @ts-ignore
      req.withInterceptor(new HttpInterceptor(this.httpClient, this.dataStore));
      req.withBaseUrl(this.applicationProperties.apiQueryEndpoint);
    });
  }

  private init(): void {
    try {
      const user = JSON.parse(this.cookieService.getCookie(EVENTS.CACHE.USER));
      if (!user || user === "null") {
        return;
      }

      this.authenticateService.setHeader(user.token);
      this.authenticateService
        .authenticateWithToken()
        .then(() => {
          //
        })
        .catch(() => this.logout());

      this.eventsStore.subscribeAndPublish(
        EVENTS.USER_REHYDRATE,
        EVENTS.USER_UPDATED,
        user,
        () => this.userValidated()
      );
    } catch (e) {
      //
    }
  }

  private userValidated(): void {
    const currentInstruction = location.href.split("/");
    const routeName = currentInstruction[currentInstruction.length - 1];
    const anonymousRoutes = [
      "login",
      "registration",
      "complete-registration",
      "registration-complete",
      "email-sent",
    ];

    if (anonymousRoutes.includes(routeName)) {
      this.router.navigate("dashboard");
      location.href = location.href.replace(routeName, "dashboard");
    }
  }

  // public goToLogin(): void {
  //   this.router.navigate("login");
  // }

  // public goToRegistration(): void {
  //   this.router.navigate("registration");
  // }

  // public goToDashboard(): void {
  //   console.log(" ::>> 1 >>>> ");
  //   this.router.navigate("dashboard");
  // }

  // public goToUsers(): void {
  //   this.router.navigate("users");
  // }

  // public goToArticles(): void {
  //   this.router.navigate("articles");
  // }

  // public goToPurchases(): void {
  //   this.router.navigate("purchases");
  // }

  // public viewCart(): void {
  //   this.router.navigate("cart");
  // }

  public logout(): void {
    this.eventAggregator.publish(EVENTS.USER_LOGGED_OUT);
    this.router.navigate("");
    this.authenticateService.logout();
  }

  // @computedFrom("dataStore.user")
  // public get isAuthenticated(): boolean {
  //   return !!this.dataStore.user;
  // }
}

@autoinject()
export class AuthStep {
  constructor(private cookieService: CookieService) {}

  run(navigationInstruction: NavigationInstruction, next: Next): any {
    const cookie = this.cookieService.getCookie(EVENTS.CACHE.USER);
    const user: IUser = cookie ? JSON.parse(cookie) : null;
    /*AUTH*/
    const isAuthRoute: boolean = navigationInstruction
      .getAllInstructions()
      .some((i) => i.config.auth);
    if (isAuthRoute) {
      if (!user) {
        return next.cancel(
          new RedirectToRoute("login", {
            from: `${document.location.pathname}${document.location.search}`,
          })
        );
      }
    }

    /*BLOCKED*/
    const isBlocked: boolean = navigationInstruction
      .getAllInstructions()
      .some((i) => i.config.isBlocked);
    if (isBlocked) {
      return next.cancel(new Redirect("/error?code=1"));
    }

    /*AUTHORISED*/
    const allInstructions: NavigationInstruction[] =
      navigationInstruction.getAllInstructions();
    const currentInstruction = allInstructions[0];
    const access: any = currentInstruction
      ? currentInstruction.config.settings.access
      : null;

    if (access && user && user.role) {
      if (!user.permissions) {
        return next.cancel(new Redirect("/unauthorised"));
      }

      let hasAccess = false;

      for (const role of access) {
        if (role === user.role && user.permissions) {
          hasAccess = true;
        }
      }
      if (!hasAccess) {
        return next.cancel(new Redirect("/error?code=2"));
      }
    }

    return next();
  }
}
