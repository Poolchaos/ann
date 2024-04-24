import { Router } from "aurelia-router";
import { customElement, containerless, autoinject } from "aurelia-framework";

@customElement("hud-layout")
@containerless()
@autoinject()
export class HudLayout {
  constructor(private router: Router) {}

  public goToDashboard(): void {
    this.router.navigate("");
  }
}
