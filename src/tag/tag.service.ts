import { GetToken, Context, Tag, Upload, Root, Check } from '@justforlxz/tools';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { App } from '../types';
import { encode } from 'src/functions';

@Injectable()
export class TagService {
  async create(app: App, context: Context, config: Root) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    return await Tag(octokit, config);
  }

  async check(app: App, context: Context, config: Root) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    return await Check(octokit, config);
  }
  async uploadFile(app: App, context: Context, root: Root) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    const path = `tags/${root.repo}.json`;
    const branch = `master`;
    try {
      let contentRef: string = undefined;
      try {
        const content = (
          await octokit.repos.getContent({
            ...context,
            path,
          })
        ).data as {
          sha: string;
        };
        contentRef = content.sha;
      } catch (err) {
        console.error(err);
      }

      await octokit.repos.createOrUpdateFileContents({
        ...context,
        path,
        message: 'update tag',
        content: encode(JSON.stringify(root, null, 4)), // base64
        branch,
        committer: {
          name: 'justforlxz',
          email: 'justforlxz@gmail.com',
        },
        author: {
          name: 'justforlxz',
          email: 'justforlxz@gmail.com',
        },
        sha: contentRef,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
