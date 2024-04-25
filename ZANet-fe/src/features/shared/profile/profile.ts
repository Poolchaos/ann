import { autoinject } from "aurelia-framework";
import {
  ValidationController,
  ValidationControllerFactory,
  ValidationRules,
  validateTrigger,
} from "aurelia-validation";

import { DataStore } from "../../../stores/data-store";
import { SVGManager } from "../../../services/svg-manager-service";

@autoinject()
export class Profile {
  private validation: ValidationController;
  public SVGManager = SVGManager;

  public user;

  constructor(
    dataStore: DataStore,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;

    if (dataStore.user) {
      this.user = JSON.parse(JSON.stringify(dataStore.user));
    }
    console.log(" ::>> profile >>>> ", this.user);
  }

  public activate(): void {
    this.setupValidations();
  }

  private setupValidations(): void {
    ValidationRules.ensure("firstname")
      .required()
      .withMessage("Please enter your name.")
      .then()
      .ensure("surname")
      .required()
      .withMessage("Please enter your name.")
      .then()
      // .ensure("password")
      // .required()
      // .withMessage("Please enter your password.")
      .on(this);
  }
}
