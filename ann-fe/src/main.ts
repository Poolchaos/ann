import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import {I18N, TCustomAttribute} from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';

// todo: detect device

const languageCodes = ['af', 'en', 'nr', 'xh', 'zu', 'st', 'nso', 'tn', 'ss', 've', 'ts' ];

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {

      let aliases = ['t', 'i18n'];
      TCustomAttribute.configureAliases(aliases);
      instance.i18next.use(Backend);

      return instance.setup({
        fallbackLng: 'en',
        whitelist: languageCodes,
        preload: languageCodes,
        ns: 'global',
        defaultNS: 'global',
        fallbackNS: false,
        attributes: aliases,
        lng: 'en',
        debug: true,
        backend: {                                  
          loadPath: './locales/{{lng}}/{{ns}}.json'
        }
      })
    })
    .feature(PLATFORM.moduleName('features/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
