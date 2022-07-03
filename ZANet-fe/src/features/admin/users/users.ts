import { Sort } from './../../../tools/sort';
import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';

import { DataStore, IUser } from 'stores/data-store';
import { UserService } from './users-service';
import { RemoveUserDialog } from './remove-user-dialog/remove-user-dialog';

@autoinject()
export class Admin {
  
  public users: IUser[] = [];

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router,
    public dataStore: DataStore
  ) {}

  public bind(): void {
    this.retrieveUsers();
  }

  private retrieveUsers(): void {
    this.userService
      .retrieveUsers()
      .then((users: IUser[]) => {
        this.users = Sort.alphabetically(users, 'email');
      })
      .catch(() => {

      })
  }

  public enableAccess(user: IUser): void {
    if (!user) return;

    this.userService
      .enableAccess(user._id)
      .then((_user) => {
        user.permissions = _user.permissions;
      })
      .catch(() => {
        console.log(' Failed to give access to user ');
      });
  }

  public disableAccess(user: IUser): void {
    if (!user) return;

    this.userService
      .disableAccess(user._id)
      .then((_user) => {
        user.permissions = _user.permissions;
      })
      .catch(() => {
        console.log(' Failed to give access to user ');
      });
  }

  public goToDashboard(): void {
    this.router.navigate('dashboard');
  }

  public removeUser(user: IUser): void {
    this.dialogService
      .open({ viewModel: RemoveUserDialog, model: user })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.removeConfirmed(user._id);
        } else {
          console.log('dialog cancelled');
        }
        console.log(response.output);
      });
  }

  private removeConfirmed(userId: string): void {
    this.userService
      .removeUser(userId)
      .then(() => {
        this.users = this.users.filter(user => user._id !== userId);
      })
      .catch(() => {

      })
  }

  // public saveUser(): void {
  //   this.httpClient.createRequest('users')
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
