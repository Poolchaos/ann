import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./admin/admin'),
    PLATFORM.moduleName('./voice-over/voice-over'),
    PLATFORM.moduleName('./default_user/default_user')
  ]);
}
