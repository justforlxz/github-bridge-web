import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from 'src/settings/settings.service';
import { IBranchCreateOptions, IBranchPutOptions } from 'src/types.branch';
import { Octokit } from '@octokit/rest';
import { GetToken } from '@justforlxz/tools';

@Injectable()
export class BranchService {
  private readonly logger: Logger = new Logger(BranchService.name);
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
        const result = await octokit.git.getRef({
          ...context,
          ref: `heads/${repo.data.default_branch}`,
        });
        sha = result.data.object.sha;
      } catch (err) {
        this.logger.error(err);
      }
    } else {
      // 检测 branch 是不是 ref，或者 sha
      try {
        const result = await octokit.git.getRef({
          ...context,
          ref: `tags/${body.base_branch}`,
        });
        sha = result.data.object.sha;
      } catch (err) {
        this.logger.error(err);
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
      throw new Error(err);
    }
  }
  async delete(repo: string, branch: string) {
    const context = {
      owner: this.settings.config.github.owner,
      repo,
    };

    const octokit = new Octokit({
      auth: await GetToken(this.settings.appInfo(), context),
    });

    return await octokit.git.deleteRef({
      ...context,
      ref: `heads/${branch}`,
    });
  }

  async lock(body: IBranchPutOptions, branch: string) {
    const context = {
      owner: this.settings.config.github.owner,
      repo: body.repo,
    };

    const octokit = new Octokit({
      auth: await GetToken(this.settings.appInfo(), context),
    });

    return await octokit.request(
      'GET /repos/{owner}/{repo}/branches/{branch}/protection',
      {
        ...context,
        branch: `heads/${branch}`,
      },
    );
  }
}
