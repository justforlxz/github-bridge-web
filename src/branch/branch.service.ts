import { Injectable } from '@nestjs/common';
import { SettingsService } from 'src/settings/settings.service';
import { IBranchCreateOptions, IBranchDeleteOptions } from 'src/types.branch';
import { Octokit } from '@octokit/rest';
import { GetToken } from '@justforlxz/tools';

@Injectable()
export class BranchService {
  constructor(private readonly settings: SettingsService) {}
  async create(branch: string, body: IBranchCreateOptions) {
    const context = {
      owner: this.settings.config.github.owner,
      repo: body.repo,
    };

    const octokit = new Octokit({
      auth: await GetToken(this.settings.appInfo(), context),
    });

    let sha: string;

    if (!body.base_branch) {
      try {
        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
          ...context,
        });
        try {
          const result = await octokit.git.getRef({
            ...context,
            ref: `heads/${repo.data.default_branch}`,
          });
          sha = result.data.object.sha;
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // 检测 branch 是不是 ref，或者 sha
      try {
        const result = await octokit.git.getRef({
          ...context,
          ref: `heads/${body.base_branch}`,
        });
        sha = result.data.object.sha;
      } catch (err) {
        sha = body.base_branch;
      }
    }

    // create ref
    try {
      await octokit.git.createRef({
        ...context,
        ref: `refs/heads/${branch}`,
        sha,
      });
    } catch (err) {
      console.error(err);
      return err;
    }
  }
  async delete(branch: string, body: IBranchDeleteOptions) {
    const context = {
      owner: this.settings.config.github.owner,
      repo: body.repo,
    };

    const octokit = new Octokit({
      auth: await GetToken(this.settings.appInfo(), context),
    });

    return await octokit.git.deleteRef({
      ...context,
      ref: `heads/${branch}`,
    });
  }
}
