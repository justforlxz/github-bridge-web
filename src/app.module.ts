import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './settings/settings.module';
import { PullsModule } from './pulls/pulls.module';
import { ContributeModule } from './contribute/contribute.module';

@Module({
  imports: [SettingsModule, PullsModule, ContributeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
