import { Router } from "aurelia-router";
import { customElement, containerless, autoinject } from "aurelia-framework";

import "./hud-layout.scss";

@customElement("hud-layout")
@containerless()
@autoinject()
export class HudLayout {
  constructor(private router: Router) {}

  public goToDashboard(): void {
    console.log(" ::>> goToDashboard >>>> ", this.router.parent);
    this.router.parent.navigate("dashboard");
  }
}
