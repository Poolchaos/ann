import { PLATFORM } from "aurelia-pal";
import { Router, RouteConfig } from "aurelia-router";
import { computedFrom } from "aurelia-framework";
import { autoinject } from "aurelia-framework";

import { DataStore } from "../../../stores/data-store";
import { SVGManager } from "../../../services/svg-manager-service";

@autoinject()
export class Settings {
  public SVGManager = SVGManager;

  constructor(private router: Router, private dataStore: DataStore) {
    console.log(" ::>> settings >>>> ");
  }

  public configureRouter(config, router): void {
    const routeConfigs: RouteConfig[] = [
      {
        route: "",
        name: "profile",
        moduleId: PLATFORM.moduleName("features/shared/profile/profile"),
        nav: true,
        title: "Profile",
        auth: true,
        settings: {
          access: ["Admin", "Journalist", "Voice_Over", "DEFAULT_USER"],
        },
      },
      {
        route: "general",
        name: "general-settings",
        moduleId: PLATFORM.moduleName(
          "features/shared/general-settings/general-settings"
        ),
        nav: true,
        title: "General Settings",
        auth: true,
        settings: {
          access: ["Admin", "Journalist", "Voice_Over", "DEFAULT_USER"],
        },
      },
      {
        route: "security",
        name: "security",
        moduleId: PLATFORM.moduleName("features/shared/security/security"),
        nav: true,
        title: "General Settings",
        auth: true,
        settings: {
          access: ["Admin", "Journalist", "Voice_Over", "DEFAULT_USER"],
        },
      },
    ];
    config.map(routeConfigs);
    this.router = router;
  }

  public goToDashboard(): void {
    this.router.parent.navigate("dashboard");
  }

  public goToProfile(): void {
    this.router.navigate("");
  }

  public goToGeneral(): void {
    this.router.navigate("general");
  }

  public goToSecurity(): void {
    this.router.navigate("security");
  }

  @computedFrom("dataStore.user")
  public get isAuthenticated(): boolean {
    return !!this.dataStore.user;
  }
}
