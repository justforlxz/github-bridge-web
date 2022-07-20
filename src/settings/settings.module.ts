import { Global, Module } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Global()
@Module({
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
