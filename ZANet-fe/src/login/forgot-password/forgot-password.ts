import { autoinject } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger } from 'aurelia-validation';
import { Router } from 'aurelia-router';

import { AuthenticateService } from "../authenticate-service";

@autoinject()
export class ForgotPassword {
  
  public identity: string;
  public submitted: boolean = false;
  public requestSubmitted: boolean = false;

  private validation: ValidationController;

  constructor(
    private authenticateService: AuthenticateService,
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
    ValidationRules.ensure('identity')
      .required()
      .withMessage('Please enter your email.')
      .then()
      .email()
      .withMessage('Please enter a valid email.')
      .on(this);
  }

  public requestPasswordReset(): void {
    if (this.submitted) return;

    this.validation
      .validate()
      .then(validation => {
        if (!validation.valid) {
          console.log(' ::>> is invalid ', validation);
          this.submitted = false;
          return;
        }
        this.triggerRequestPasswordReset();
      })
      .catch(() => {
        this.submitted = false;
      });
  }

  private triggerRequestPasswordReset(): void {
    this.submitted = true;
    this.authenticateService
      .requestPasswordReset(this.identity)
      .then(() => this.requestSubmitted = true)
      .catch(error => {
        console.warn('Failed to request password reset', error);
        this.submitted = false;
      });
  }

  private goToLogin(): void {
    this.router.navigate('');
  }
}