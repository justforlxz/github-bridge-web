import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './settings/settings.module';
import { PullsModule } from './pulls/pulls.module';

@Module({
  imports: [SettingsModule, PullsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
