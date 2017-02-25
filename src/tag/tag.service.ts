import { Injectable } from '@nestjs/common';
import { GetToken, Check, Tag, Root } from '@justforlxz/tools';
import { Octokit } from '@octokit/rest';

@Injectable()
export class TagService {
  async check(
    app: { APP_ID: number; APP_PRIVATE_KEY: string },
    context: { owner: string; repo: string },
    config: Root,
  ) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    return Check(octokit, config);
  }

  async createTag(
    app: { APP_ID: number; APP_PRIVATE_KEY: string },
    context: { owner: string; repo: string },
    config: Root,
  ) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    return Tag(octokit, config);
  }
}
