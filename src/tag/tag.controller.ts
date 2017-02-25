import { Root } from '@justforlxz/tools';
import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(
    private tagService: TagService,
    private settings: SettingsService,
  ) {}

  @Post('create')
  async create(
    @Req() request: Request,
    @Param('repo') repo: string,
    @Param('config') config: Root,
  ) {
    return this.tagService.createTag(
      this.settings.appInfo(),
      {
        owner: 'linuxdeepin',
        repo,
      },
      config,
    );
  }

  @Get('check')
  async check(
    @Req() request: Request,
    @Param('repo') repo: string,
    @Param('config') config: Root,
  ) {
    return this.tagService.check(
      this.settings.appInfo(),
      {
        owner: 'linuxdeepin',
        repo,
      },
      config,
    );
  }
}
