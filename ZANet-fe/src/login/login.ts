import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger } from 'aurelia-validation';

import { AuthenticateService } from "./authenticate-service";
import { ILogin } from 'stores/data-store';
import { EventsStore } from 'stores/events-store';
import { EVENTS } from 'stores/events';

@autoinject()
export class Login {

  public identity: string;
  public password: string;
  public submitted: boolean = false;
  public error: string;

  private validation: ValidationController;
  private fromRoute: string;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService,
    private eventsStore: EventsStore,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(params: { from: string }): void {
    this.fromRoute = params.from;

    this.setupValidations();
  }

  private setupValidations(): void {
    ValidationRules.ensure('identity')
      .required()
      .withMessage('Please enter your email.')
      .then()
      .email()
      .withMessage('Please enter a valid email.')
      .ensure('password')
      .required()
      .withMessage('Please enter your password.')
      .on(this);
  }

  public clearErrors(): void {
    this.error = null;
  }

  public forgotPassword(): void {
    this.router.navigate('forgot-password');
  }

  public goToRegister(): void {
    this.router.navigate('registration');
  }

  // social media integration
  // todo: login via fb
  // todo: login via twitter
  // todo: login via google

  public login(): void {
    if (this.submitted) return;
    this.error = null;

    this.validation
      .validate()
      .then(validation => {
        if (!validation.valid) {
          console.log(' ::>> is invalid ', validation);
          this.submitted = false;
          return;
        }
        this.triggerLogin();
      })
      .catch(() => {
        this.submitted = false;
        this.error = 'Email or password is incorrect. Please try again.';
      });
  }

  private triggerLogin(): void {
    this.authenticateService
      .authenticate(this.identity, this.password)
      .then(user => this.handleUserAuthenticated(user))
      .catch(error => {
        this.error = error;
      });
  }

  private handleUserAuthenticated(user: ILogin): void {

    this.eventsStore
      .subscribeAndPublish(
        EVENTS.USER_LOGGED_IN,
        EVENTS.USER_UPDATED,
        user,
        () => {
          if (this.fromRoute) {
            this.router.navigate(this.fromRoute);
          } else {
            this.router.navigate('dashboard');
          }
        }
      );
  }

  public signInViaFacebook(): void {
    
  }

  public signInViaTwitter(): void {
    
  }

  public signInViaGoogle(): void {
  }
}