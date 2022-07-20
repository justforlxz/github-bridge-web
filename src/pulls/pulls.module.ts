import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { PullsController } from './pulls.controller';
import { PullsService } from './pulls.service';

@Module({
  imports: [SettingsModule],
  controllers: [PullsController],
  providers: [PullsService],
})
export class PullsModule {}
