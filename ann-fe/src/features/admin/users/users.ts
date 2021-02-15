import { autoinject, containerless } from 'aurelia-framework';

import { IUser } from 'stores/data-store';
import { UserService } from './users-service';

@autoinject()
export class Admin {
  
  public users: IUser[] = [];

  constructor(private userService: UserService) {}

  public bind(): void {
    this.retrieveUsers();
  }

  private retrieveUsers(): void {
    console.log(' ::>> retrieveUsers >>>>> ');
    this.userService
      .retrieveUsers()
      .then((users: IUser[]) => {
        console.log(' ::>> data >>>> ', users);
        this.users = users;
      })
      .catch(() => {

      })
  }

  // public saveUser(): void {
  //   this.httpClient.createRequest('http://localhost:3000/users')
  //     .asPost()
  //     .withContent({  })
  //     .send()
  //     .then(
  //       (response) => {
  //         console.log(' ::>> response ', response);
  //       },
  //       (error) => {
  //         console.warn(' ::>> error ', error);
  //       }
  //     );
  // }
}