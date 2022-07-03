import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';

import { DataStore, IUser } from 'stores/data-store';
import { UserService } from './users-service';
import { RemoveUserDialog } from './remove-user-dialog/remove-user-dialog';
import { CookieService } from 'services/cookie-service';
import { EVENTS } from 'stores/events';
import { Sort } from 'tools/sort';

@autoinject()
export class Admin {
  
  public users: IUser[] = [];

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router,
    public dataStore: DataStore,
    private cookieService: CookieService
  ) {}

  public bind(): void {
    this.retrieveUsers();
  }

  private retrieveUsers(): void {
    this.userService
      .retrieveUsers()
      .then((users: IUser[]) => {

        let cachedUser = JSON.parse(this.cookieService.getCookie(EVENTS.CACHE.USER));
        let user;
        if (cachedUser && cachedUser !== 'null') {
          console.log(' ::>> user >>>>> ', cachedUser, users);
          user = users.find(_user => _user._id === cachedUser._id);
          if (user) {
            users = users.filter(_user => _user._id !== cachedUser._id);
          }
        }

        this.users = [user, ...Sort.alphabetically(users, 'email')];
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
