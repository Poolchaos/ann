import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { RegistrationService } from './registration-service';
import { CookieService } from 'services/cookie-service';

@autoinject()
export class Registration {

  public roles: { name: string; selected?: boolean }[] = [
    { name: 'Joernalis'},
    { name: 'Voice Over Artist' }
  ];
  public firstName: string;
  public surname: string;
  public email: string;
  public number: string;

  private selectedRoles: string[];

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private cookieService: CookieService
    ) {
    console.log(' ::>> Registration ');
  }

  public selectRole(role: { name: string; selected?: boolean; }): void {
    this.selectedRoles = [];
    role.selected = !role.selected;

    this.roles.filter(role => {
      if (role.selected) {
        this.selectedRoles.push(role.name);
      }
    });
  }

  public register(): void {
    const user = {
      firstName: this.firstName,
      surname: this.surname,
      email: this.email,
      number: this.number,
      roles: this.selectedRoles
    };

    console.log(' ::>> this.user >>> ', user);
    this.registrationService
      .registerUser(
        this.firstName,
        this.surname,
        this.email,
        this.number,
        this.selectedRoles
      )
      .then((userRegistration: any) => {
        console.log(' ::>> response = ', userRegistration);
        // this.cookieService.setCookie('ann-registration', JSON.stringify(userRegistration), 1);
        // route to email sent page
        this.router.navigate('email-sent'); // email will bring the user here
      })
      .catch(() => {
        // todo: show some error
      });
  }
}