import {inject, LogManager} from 'aurelia-framework';
import { AureliaConfiguration } from 'aurelia-configuration';

const logger = LogManager.getLogger('ApplicationProperties');

@inject(AureliaConfiguration)
export class ApplicationProperties {

  constructor(private config: AureliaConfiguration) {}

  get apiQueryEndpoint() {
    return this.config.get('apiQueryEndpoint');
  }

}
