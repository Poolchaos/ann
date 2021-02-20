import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

import { DataStore, IUser } from 'stores/data-store';
import { UserService } from './users-service';
import { RemoveUserDialog } from './remove-user-dialog/remove-user-dialog';

@autoinject()
export class Admin {
  
  public users: IUser[] = [];

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    public dataStore: DataStore
  ) {}

  public bind(): void {
    this.retrieveUsers();
  }

  private retrieveUsers(): void {
    this.userService
      .retrieveUsers()
      .then((users: IUser[]) => {
        this.users = users;
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