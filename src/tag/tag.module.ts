import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [SettingsModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
