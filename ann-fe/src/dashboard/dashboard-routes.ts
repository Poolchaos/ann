import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class DashboardRoutes {

  public static get routes(): RouteConfig[] {
    return this.adminRoutes().concat(this.journalistRoutes(), this.voiceOverRoutes(), this.defaultUserRoutes());
  }

  public static get globalRoutes(): RouteConfig[] {
    return this.global();
  }

  private static global(): RouteConfig[] {
    return [{
      route: ['', 'error/:code'],
      name: 'error',
      moduleId: PLATFORM.moduleName('error/error'),
      nav: false,
      title: 'Error',
      auth: false
    }];
  }

  private static adminRoutes(): RouteConfig[] {
    return [{
      route: ['admin'],
      name: 'admin',
      moduleId: PLATFORM.moduleName('features/admin/admin'),
      nav: true,
      title: 'Admin',
      auth: true,
      settings: {
        access: ['Admin']
      }
    }];
  }

  private static journalistRoutes(): RouteConfig[] {
    return [{
      route: ['journalist'],
      name: 'journalist',
      moduleId: PLATFORM.moduleName('features/journalist/journalist'),
      nav: true,
      title: 'Journalist',
      auth: true,
      settings: {
        access: ['Journalist']
      }
    }, {
      route: 'articles',
      name: 'articles',
      moduleId: PLATFORM.moduleName('features/journalist/articles/articles'),
      nav: true,
      title: 'Articles',
      auth: true,
      settings: {
        access: ['Journalist']
      }
    }, {
      route: 'create-article',
      name: 'create-article',
      moduleId: PLATFORM.moduleName('features/journalist/articles/create-article/create-article'),
      nav: true,
      title: 'Create Article',
      auth: true,
      settings: {
        access: ['Journalist']
      }
    }];
  }

  private static voiceOverRoutes(): RouteConfig[] {
    return [{
      route: ['voice-over'],
      name: 'voice-over',
      moduleId: PLATFORM.moduleName('features/voice-over/voice-over'),
      nav: true,
      title: 'Voice Over',
      auth: true,
      settings: {
        access: ['Voice-Over']
      }
    }];
  }

  private static defaultUserRoutes(): RouteConfig[] {
    return [{
      route: ['default-user'],
      name: 'default_user',
      moduleId: PLATFORM.moduleName('features/default_user/default_user'),
      nav: true,
      title: 'Default User',
      auth: true,
      settings: {
        access: ['DEFAULT_USER']
      }
    }];
  }
}