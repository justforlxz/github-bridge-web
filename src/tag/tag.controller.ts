import { Context, Root } from '@justforlxz/tools';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { TagService } from './tag.service';
import { Response } from 'express';

@Controller('tag')
export class TagController {
  constructor(private service: TagService, private settings: SettingsService) {}
  @Post('create')
  async create(@Body() body: Root, @Res({ passthrough: true }) res: Response) {
    const context: Context = {
      owner: this.settings.config.github.owner,
      repo: body.repo,
    };

    try {
      await this.service.check(this.settings.appInfo(), context, body);
    } catch (err) {
      return {
        code: 201,
        message: err,
        data: body,
      };
    }

    try {
      await this.service.create(this.settings.appInfo(), context, body);
      await this.service.uploadFile(
        this.settings.appInfo(),
        {
          owner: context.owner,
          repo: 'release',
        },
        body,
      );
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
