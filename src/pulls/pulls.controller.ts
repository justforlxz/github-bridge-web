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

    try {
      const check = await this.service.check(
        this.settings.appInfo(),
        context,
        body,
      );
      if (check !== 0) {
        throw new Error(`check tag failed. code is ${check}`);
      }
    } catch (err) {
      return {
        code: 201,
        message: 'check tag failed.',
        data: body,
      };
    }

    try {
      await this.service.create(this.settings.appInfo(), context, body);
      await this.service.uploadFile(this.settings.appInfo(), context, body);
      return {
        code: 200,
        message: 'request create tag successd.',
        data: body,
      };
    } catch (err) {
      return {
        code: 201,
        message: 'create tag failed.',
        data: body,
      };
    }
  }
}
