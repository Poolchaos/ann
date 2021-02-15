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
      console.log(' ::>> this.dataStore.user.role.toLowerCase() >>> ', this.dataStore.user.role.toLowerCase());
      routes.forEach(route => {
        console.log(' ::>> route.name ', route.name);
        if (this.dataStore.user.role.toLowerCase() === route.name) {
          console.log(' ::>> routing to ', route.name);
          this.router.navigate(route.name);
        }
      });
    }
  }

}