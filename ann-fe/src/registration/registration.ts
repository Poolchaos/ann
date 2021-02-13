import { autoinject } from 'aurelia-framework';
import { HttpClient } from "aurelia-http-client";

import { UserRegistrationSettings } from './user-registration-settings';

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
    private httpClient: HttpClient
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
    this.httpClient.createRequest('http://localhost:3000/passport/submit')
      .asPost()
      .withContent(user)
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
      .send()
      .then(
        (response) => {
          console.log(' ::>> response ', response);
        },
        (error) => {
          console.warn(' ::>> error ', error);
        }
      );
  }
}