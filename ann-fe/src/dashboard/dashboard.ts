import { autoinject } from 'aurelia-framework';
import { Router, RouteConfig } from 'aurelia-router';

import { DataStore } from 'stores/data-store';
import { CookieService } from 'services/cookie-service';
import { EventsStore } from 'stores/events-store';
import { EVENTS } from 'stores/events';
import { DashboardRoutes } from './dashboard-routes';

@autoinject()
export class Dashboard {

  public router: Router

  constructor(private dataStore: DataStore) {}

  public configureRouter(config, router): void {
    
    let routeConfigs: RouteConfig[];

    if (this.dataStore.user) {
      routeConfigs = DashboardRoutes.routes;
      routeConfigs.forEach(route => {
        if (this.dataStore.user.role.toLowerCase() === route.name) {
          // @ts-ignore
          route.route.push('');
        }
      });
    } else {
      routeConfigs = DashboardRoutes.globalRoutes;
    }

    config.map(routeConfigs);
    this.router = router;
  }

}