import { customElement } from 'aurelia-framework';

import { I18N } from 'aurelia-i18n';
import { LOCALES } from 'locales';
import { CookieService } from 'services/cookie-service';
import { EVENTS } from 'stores/events';

@customElement('language-selector')
export class LanguageSelector {
  public locales: any;
  public currentLocale: any;

  constructor(
    private i18n: I18N,
    private cookieService: CookieService
  ) {
    console.log(' ::>> language selector ');
    this.locales = LOCALES;
    const code = this.cookieService.getCookie(EVENTS.CACHE.LOCALE);
    if (code) {
      this.setLocale({ code });
    } else {
      this.currentLocale = this.i18n.getLocale();
    }
  }

  public setLocale(locale: { code: string }): void {
    let code = locale.code
    if(this.currentLocale !== code) {
      this.i18n.setLocale(code);
      this.currentLocale = code;
      this.cookieService.setCookie(EVENTS.CACHE.LOCALE, code);
    }
  }
}