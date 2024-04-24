import { RouteConfig } from "aurelia-router";
import { PLATFORM } from "aurelia-pal";

export class AppRoutes {
  constructor() {}

  public static get routes(): RouteConfig[] {
    return this.errorRoutes().concat(
      this.loginRoutes(),
      this.registrationRoutes(),
      this.authRoutes(),
      this.sharedRoutes()
    );
  }

  private static loginRoutes(): RouteConfig[] {
    return [
      {
        route: ["", "login"],
        name: "login",
        moduleId: PLATFORM.moduleName("login/login"),
        nav: true,
        title: "Login",
        auth: false,
      },
      {
        route: "forgot-password",
        name: "forgot-password",
        moduleId: PLATFORM.moduleName("login/forgot-password/forgot-password"),
        nav: true,
        title: "Forgot Password",
        auth: false,
      },
      {
        route: "reset-password",
        name: "reset-password",
        moduleId: PLATFORM.moduleName("login/reset-password/reset-password"),
        nav: true,
        title: "Reset Password",
        auth: false,
      },
      {
        route: "unauthorised",
        name: "unauthorised",
        moduleId: PLATFORM.moduleName("unauthorised/unauthorised"),
        nav: true,
        title: "Unauthorised",
        auth: false,
      },
    ];
  }

  private static registrationRoutes(): RouteConfig[] {
    return [
      {
        route: "registration",
        name: "registration",
        moduleId: PLATFORM.moduleName("registration/registration"),
        nav: true,
        title: "Registration",
        auth: false,
      },
      {
        route: "email-sent",
        name: "email-sent",
        moduleId: PLATFORM.moduleName("registration/email-sent/email-sent"),
        nav: true,
        title: "email-sent",
        auth: false,
      },
      {
        route: "deny-registration",
        name: "deny-registration",
        moduleId: PLATFORM.moduleName(
          "registration/deny-registration/deny-registration"
        ),
        nav: true,
        title: "Invalid Registration",
        auth: false,
      },
      {
        route: "registration-complete",
        name: "registration-complete",
        moduleId: PLATFORM.moduleName(
          "registration/registration-complete/registration-complete"
        ),
        nav: true,
        title: "Registration Complete",
        auth: false,
      },
      {
        route: "complete-registration",
        name: "complete-registration",
        moduleId: PLATFORM.moduleName(
          "registration/complete-registration/complete-registration"
        ),
        nav: true,
        title: "Complete Registration",
        auth: false,
      },
    ];
  }

  public static authRoutes(): RouteConfig[] {
    return [
      {
        route: "dashboard",
        name: "dashboard",
        moduleId: PLATFORM.moduleName("dashboard/dashboard"),
        nav: true,
        title: "Dashboard",
        auth: true,
        settings: {
          access: ["DEFAULT_USER", "Admin", "Journalist", "Voice-Over"],
        },
      },
    ];
  }

  private static errorRoutes(): RouteConfig[] {
    return [
      {
        route: "error",
        name: "error",
        moduleId: PLATFORM.moduleName("error/error"),
        nav: false,
        title: "Error",
        auth: false,
      },
    ];
  }

  private static sharedRoutes(): RouteConfig[] {
    return [
      {
        route: "profile",
        name: "profile",
        moduleId: PLATFORM.moduleName("features/shared/profile/profile"),
        nav: true,
        title: "Profile",
        auth: true,
        settings: {
          access: ["Admin", "Journalist", "Voice_Over", "DEFAULT_USER"],
        },
      },
      {
        route: "settings",
        name: "settings",
        moduleId: PLATFORM.moduleName("features/shared/settings/settings"),
        nav: true,
        title: "Settings",
        auth: true,
        settings: {
          access: ["Admin", "Journalist", "Voice_Over", "DEFAULT_USER"],
        },
      },
    ];
  }
}
