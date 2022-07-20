import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { TagModule } from './tag/tag.module';
import { SettingsModule } from './settings/settings.module';
import { PullsModule } from './pulls/pulls.module';

@Module({
  imports: [TokenModule, TagModule, SettingsModule, PullsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
