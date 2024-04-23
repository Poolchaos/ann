import { FrameworkConfiguration } from "aurelia-framework";
import { PLATFORM } from "aurelia-pal";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName("./language-selector/languageselector"),
    PLATFORM.moduleName("./settings-menu/settings-menu"),
  ]);
}
