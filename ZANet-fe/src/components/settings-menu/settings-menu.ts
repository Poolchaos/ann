import { Router } from "aurelia-router";
import { customElement, autoinject, computedFrom } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

import { DataStore } from "../../stores/data-store";
import { SVGManager } from "../../services/svg-manager-service";
import { AuthenticateService } from "../../login/authenticate-service";
import { EVENTS } from "../../stores/events";

import "./settings-menu.scss";

@customElement("settings-menu")
@autoinject
export class SettingsMenu {
  public SVGManager = SVGManager;
  public isOpen: boolean;

  constructor(
    private dataStore: DataStore,
    private router: Router,
    private eventAggregator: EventAggregator,
    private authenticateService: AuthenticateService
  ) {
    console.log(" ::>> dataStore ", this.dataStore.user);
  }

  public showMenu(): void {
    this.isOpen = true;
  }

  public closeMenu(): void {
    this.isOpen = false;
  }

  public navToSettings(): void {
    // todo;
    console.log(" ::>> todo >>>> ");
  }

  public logout(): void {
    this.eventAggregator.publish(EVENTS.USER_LOGGED_OUT);
    this.router.navigate("");
    this.authenticateService.logout();
  }

  @computedFrom("dataStore.user")
  public get isAuthenticated(): boolean {
    return !!this.dataStore.user;
  }
}
