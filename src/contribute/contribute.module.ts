import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SettingsModule } from 'src/settings/settings.module';
import { ContributeController } from './contribute.controller';
import { ContributeService } from './contribute.service';

@Module({
  imports: [HttpModule, SettingsModule],
  controllers: [ContributeController],
  providers: [ContributeService],
})
export class ContributeModule {}
