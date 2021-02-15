import { autoinject, containerless } from 'aurelia-framework';

import { DashboardService } from 'dashboard/dashboard-service';
import { IUser } from 'stores/data-store';

@autoinject()
export class Admin {
  
  public users: IUser[] = [];

  constructor(private dashboardService: DashboardService) {}

  public bind(): void {
    this.retrieveUsers();
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

  private retrieveUsers(): void {
    console.log(' ::>> retrieveUsers >>>>> ');
    this.dashboardService
      .retrieveUsers()
      .then((users: IUser[]) => {
        console.log(' ::>> data >>>> ', users);
        this.users = users;
      })
      .catch(() => {

      })
  }
}