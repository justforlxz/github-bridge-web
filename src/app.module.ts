import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './settings/settings.module';
import { TagModule } from './tag/tag.module';
import { ContributeModule } from './contribute/contribute.module';
import { BranchModule } from './branch/branch.module';

@Module({
  imports: [SettingsModule, TagModule, ContributeModule, BranchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
