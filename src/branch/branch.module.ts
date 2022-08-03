import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SettingsModule } from 'src/settings/settings.module';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [HttpModule, SettingsModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
