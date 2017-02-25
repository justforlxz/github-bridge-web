import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { TagModule } from './tag/tag.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [TokenModule, TagModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
