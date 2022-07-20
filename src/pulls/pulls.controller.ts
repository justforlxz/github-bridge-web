import { Context, Root } from '@justforlxz/tools';
import { Body, Controller, Post } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { PullsService } from './pulls.service';

@Controller('pulls')
export class PullsController {
  constructor(
    private service: PullsService,
    private settings: SettingsService,
  ) {}
  @Post('create')
  async create(@Body() body: Root) {
    const context: Context = {
      owner: this.settings.config.github.owner,
      repo: 'release',
    };
    return this.service.create(this.settings.appInfo(), context, body);
  }

  @Post('merge')
  async merge(@Body() body: Root) {
    const context: Context = {
      owner: this.settings.config.github.owner,
      repo: 'release',
    };
    return this.service.merge(this.settings.appInfo(), context, body);
  }

  @Post('close')
  async close(@Body() body: Root) {
    const context: Context = {
      owner: this.settings.config.github.owner,
      repo: 'release',
    };
    return this.service.close(this.settings.appInfo(), context, body);
  }
}
