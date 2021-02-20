import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger } from 'aurelia-validation';

import { RegistrationService } from 'registration/registration-service';
import { AuthenticateService } from 'login/authenticate-service';

@autoinject()
export class ResetPassword {

  public password: string;
  public isValid: boolean;

  private token: string;
  private validation: ValidationController;

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private authenticateService: AuthenticateService,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }
  
  public activate(params: { token: string }): void {
    if (!params.token) {
      this.triggerNoTokenPresent();
      return;
    }
    // todo: serverside, check if date in token
    this.token = params.token;
    this.validateToken();
  }

  private validateToken(): void {
    this.authenticateService
      .validateToken(this.token)
      .then((token: string) => {
        this.token = token;
        this.setupValidations();
      })
      .catch(() => this.triggerInvalidToken());
  }

  private triggerNoTokenPresent(): void {
    // todo: implement something went wrong, please contact support to resolve this issue
  }

  private triggerInvalidToken(): void {
    // todo: implement something went wrong, please contact support to resolve this issue
    // token expired
  }

  private setupValidations(): void {
    this.isValid = true;
    
    ValidationRules
      .customRule('confirmPassword', (value) => value === this.password, 'Your passwords do not match.');

    ValidationRules.ensure('password')
      .required()
      .withMessage('Please enter your password.')
      .matches(/^(?=\S*\d)(?=\S*[a-z])(?=\S*[A-Z])\S{8,50}$/)
      .withMessage('Must be between 8 and 50 characters long, and contain at least one lowercase, one uppercase and one number.')
      .ensure('confirmPassword')
      .required()
      .withMessage('Please enter your password again.')
      .ensure('confirmPassword')
      .satisfiesRule('confirmPassword')
      .on(this);
  }

  public confirmPasswordReset(): void {

    this.validation
      .validate()
      .then(validation => {
        if (!validation.valid) return;
        
        this.authenticateService
          .resetPassword(this.token, this.password)
          .then(() => {
            console.log(' ::>> registration Complete >>> navigating to login');
            this.router.navigate('login');
          })
          .catch(() => {
            // this.router.navigate('login');

            console.log(' ::>> failed to reset password');
          });
      }
    );
  }
}