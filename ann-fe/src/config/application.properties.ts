import { autoinject, LogManager, Container } from 'aurelia-framework';
import { AureliaConfiguration } from 'aurelia-configuration';

const logger = LogManager.getLogger('ApplicationProperties');

let configure = Container.instance.get(AureliaConfiguration);
// @ts-ignore
const environment = configure.environment;

@autoinject()
export class ApplicationProperties {

  constructor(private config: AureliaConfiguration) {
    console.log(' ::>> config >>>> ', config);
    console.log(' ::>> config test ', {
      debug: this.config.get('debug')
    });
  }

  get apiQueryEndpoint() {
    return this.config.get(environment).apiQueryEndpoint;
  }

}
