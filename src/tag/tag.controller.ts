import { Root } from '@justforlxz/tools';
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  Response,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
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
    @Query('repo') repo: string,
    @Query('config') config: Root,
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
    @Query('repo') repo: string,
    @Query('tag') tag: string,
    @Query('sha') object: string,
  ) {
    const result = await this.tagService.check(
      this.settings.appInfo(),
      {
        owner: 'linuxdeepin',
        repo,
      },
      {
        repo,
        data: {
          tag,
          object,
          tagger: {
            name: '',
            email: '',
          },
          message: '',
        },
        apiVersion: '',
      },
    );

    if (result === 1) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
