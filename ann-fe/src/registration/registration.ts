import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger } from 'aurelia-validation';

import { RegistrationService } from './registration-service';

@autoinject()
export class Registration {

  public firstName: string;
  public surname: string;
  public email: string;
  public number: string;
  public submitted: boolean = false;

  private validation: ValidationController;

  private selectedRole: string;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(): void {
    this.setupValidations();
  }

  private setupValidations(): void {
    ValidationRules.ensure('firstName')
      .required()
      .withMessage('Please enter your first name.')
      .ensure('surname')
      .required()
      .withMessage('Please enter your last name.')
      .ensure('email')
      .required()
      .withMessage('Please enter your email.')
      .then()
      .email()
      .withMessage('Please enter a valid email.')
      .ensure('number')
      .required()
      .withMessage('Please enter your contact number.')
      .on(this);
  }

  public selectRole(role: string): void {
    this.selectedRole = role;
  }

  public register(): void {

    this.validation
      .validate()
      .then(validation => {
        if (!validation.valid) {
          console.log(' ::>> is invalid ', validation);
          this.submitted = false;
          return;
        }
        this.triggerRegistration();
      }, () => {
        this.submitted = false;
      });
  }

  private triggerRegistration(): void {
    this.registrationService
      .registerUser(
        this.firstName,
        this.surname,
        this.email,
        this.number,
        this.selectedRole
      )
      .then(() => this.router.navigate('email-sent'))
      .catch(() => {
        // todo: show some error
      });
  }
}