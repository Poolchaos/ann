import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class DashboardRoutes {

  public static get routes(): RouteConfig[] {
    return this.adminRoutes().concat(this.journalistRoutes(), this.voiceOverRoutes(), this.defaultUserRoutes());
  }

  private static adminRoutes(): RouteConfig[] {
    return [{
      route: 'admin',
      name: 'admin',
      moduleId: PLATFORM.moduleName('features/admin/admin'),
      nav: true,
      title: 'Dashboard',
      auth: true,
      settings: {
        access: ['Admin']
      }
    }, {
      route: 'users',
      name: 'users',
      moduleId: PLATFORM.moduleName('features/admin/users/users'),
      nav: true,
      title: 'Users',
      auth: true,
      settings: {
        access: ['Admin']
      }
    }];
  }

  private static journalistRoutes(): RouteConfig[] {
    return [{
      route: 'journalist',
      name: 'journalist',
      moduleId: PLATFORM.moduleName('features/journalist/journalist'),
      nav: true,
      title: 'Dashboard',
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
        access: ['Admin', 'Journalist', 'DEFAULT_USER']
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
    }, {
      route: 'edit-article',
      name: 'edit-article',
      moduleId: PLATFORM.moduleName('features/journalist/articles/create-article/create-article'),
      nav: true,
      title: 'Edit Article',
      auth: true,
      settings: {
        access: ['Journalist']
      }
    }];
  }

  private static voiceOverRoutes(): RouteConfig[] {
    return [{
      route: 'voice-over',
      name: 'voice-over',
      moduleId: PLATFORM.moduleName('features/voice-over/voice-over'),
      nav: true,
      title: 'Dashboard',
      auth: true,
      settings: {
        access: ['Voice-Over']
      }
    }];
  }

  private static defaultUserRoutes(): RouteConfig[] {
    return [{
      route: 'default_user',
      name: 'default_user',
      moduleId: PLATFORM.moduleName('features/default_user/default_user'),
      nav: true,
      title: 'Dashboard',
      auth: true,
      settings: {
        access: ['DEFAULT_USER']
      }
    }, {
      route: 'cart',
      name: 'cart',
      moduleId: PLATFORM.moduleName('features/default_user/cart/cart'),
      nav: true,
      title: 'Cart',
      auth: true,
      settings: {
        access: ['DEFAULT_USER']
      }
    }, {
      route: 'purchases',
      name: 'purchases',
      moduleId: PLATFORM.moduleName('features/default_user/purchases/purchases'),
      nav: true,
      title: 'Purchases',
      auth: true,
      settings: {
        access: ['Admin', 'DEFAULT_USER']
      }
    }, {
      route: 'checkout-complete',
      name: 'checkout-complete',
      moduleId: PLATFORM.moduleName('features/default_user/cart/checkout-complete/checkout-complete'),
      nav: true,
      title: 'Checkout complete',
      auth: true,
      settings: {
        access: ['DEFAULT_USER']
      }
    }];
  }
}