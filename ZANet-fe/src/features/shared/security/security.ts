import { autoinject } from "aurelia-framework";

import { SVGManager } from "../../../services/svg-manager-service";
import { DataStore } from "../../../stores/data-store";

@autoinject()
export class Security {
  public SVGManager = SVGManager;

  public user;

  constructor(dataStore: DataStore) {
    console.log(" ::>> security >>>> ", dataStore);
    if (dataStore.user) {
      this.user = JSON.parse(JSON.stringify(dataStore.user));
    }
  }
}
