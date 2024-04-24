import { autoinject, computedFrom } from "aurelia-framework";
import { Router, RouteConfig } from "aurelia-router";

import { DataStore } from "stores/data-store";
import { SVGManager } from "../services/svg-manager-service";
import { DashboardRoutes } from "./dashboard-routes";

import "./dashboard.scss";

@autoinject()
export class Dashboard {
  public SVGManager = SVGManager;

  constructor(private dataStore: DataStore, private router: Router) {}

  public configureRouter(config, router): void {
    const routeConfigs: RouteConfig[] = [].concat(DashboardRoutes.routes);
    config.map(routeConfigs);
    this.router = router;
  }

  public activate(): void {
    console.log(" ::>> dataStore ::>> ", this.dataStore);
    if (this.dataStore.user) {
      if (this.dataStore.isAdmin) {
        this.router.navigate("admin");
      } else if (this.dataStore.isJournalist) {
        this.router.navigate("journalist");
      } else if (this.dataStore.isVoiceOver) {
        this.router.navigate("voice-over");
      } else if (this.dataStore.isUser) {
        this.router.navigate("default_user");
      }
    }
  }

  public goToLogin(): void {
    this.router.navigate("login");
  }

  public goToRegistration(): void {
    this.router.navigate("registration");
  }

  public goToDashboard(): void {
    this.router.navigate("dashboard");
  }

  public goToUsers(): void {
    this.router.navigate("users");
  }

  public goToArticles(): void {
    this.router.navigate("articles");
  }

  public goToPurchases(): void {
    this.router.navigate("purchases");
  }

  public viewCart(): void {
    this.router.navigate("cart");
  }

  @computedFrom("dataStore.user")
  public get isAuthenticated(): boolean {
    return !!this.dataStore.user;
  }
}
