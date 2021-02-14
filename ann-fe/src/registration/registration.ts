import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { RegistrationService } from './registration-service';

@autoinject()
export class Registration {

  public roles: { name: string; selected?: boolean }[] = [
    { name: 'Admin'},
    { name: 'Joernalis'},
    { name: 'Voice-Over' }
  ];
  public firstName: string;
  public surname: string;
  public email: string;
  public number: string;

  private selectedRole: string;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {
    console.log(' ::>> Registration ');
  }

  public selectRole(role: { name: string; selected?: boolean; }): void {
    this.roles.forEach(role => role.selected = false);
    role.selected = true;
    this.selectedRole = role.name;
  }

  public register(): void {

    // todo: add validation

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