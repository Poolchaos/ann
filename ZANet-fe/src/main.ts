import {Aurelia} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {I18N, TCustomAttribute} from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';
import { AureliaConfiguration } from 'aurelia-configuration';

// todo: detect device

const languageCodes = ['af', 'en', 'nr', 'xh', 'zu', 'st', 'nso', 'tn', 'ss', 've', 'ts' ];

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-configuration'), config => {

      config.setEnvironments({
        'default': ['localhost:8080'],
        'debug': ['tbd'],
        'testing': ['tbd'],
        'dev1': ['tbd'],
        'prod': ['tbd'],
      });
    })
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
        debug: false,
        backend: {                                  
          loadPath: './locales/{{lng}}/{{ns}}.json'
        }
      })
    })
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .feature(PLATFORM.moduleName('features/index'))
    .feature(PLATFORM.moduleName('components/index'));

    
  let configure = aurelia.container.get(AureliaConfiguration);
  console.log(' ::>> configure >>>>> ', configure);
  // @ts-ignore
  if (configure.environment === 'prod' || configure.environment === 'staging') {
    // LogManager.setLevel(LogManager.logLevel.warn);
  }

  // @ts-ignore
  aurelia.use.developmentLogging(configure.environment.debug ? 'debug' : 'warn');

  // @ts-ignore
  if (configure.environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
