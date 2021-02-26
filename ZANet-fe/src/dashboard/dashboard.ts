import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { DataStore } from 'stores/data-store';
import { DashboardRoutes } from './dashboard-routes';

@autoinject()
export class Dashboard {

  constructor(
    private dataStore: DataStore,
    private router: Router
  ) {}

  public activate(): void {
    if (this.dataStore.user) {
      const routes = DashboardRoutes.routes;
      routes.forEach(route => {
        if (this.dataStore.user.role.toLowerCase() === route.name) {
          this.router.navigate(route.name);
        }
      });
    }
  }

}