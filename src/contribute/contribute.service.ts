import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Root, RowEnum, Repo, SourceValue } from 'src/types.cooperation';
import * as fs from 'fs';
import { encode } from 'src/functions';
import { SettingsService } from 'src/settings/settings.service';
import { GetToken } from '@justforlxz/tools';
import { Octokit } from '@octokit/rest';

@Injectable()
export class ContributeService {
  constructor(
    private readonly axios: HttpService,
    private readonly settings: SettingsService,
  ) {}
  async update() {
    const result = await firstValueFrom(
      this.axios.post<Root>(
        `${this.settings.config.cooperation.baseUrl}/api/v2/open/worksheet/getFilterRows`,
        {
          appKey: this.settings.config.cooperation.appKey,
          sign: this.settings.config.cooperation.sign,
          worksheetId: 'sybddj',
          viewId: '62cbca4b4f0cd46903df571c',
          pageSize: 99999,
          filters: [],
        },
      ),
    );
    interface Info {
      repo: string;
      addition: number;
      deletion: number;
      url: string;
    }

    const infos: Map<string, Info> = new Map<string, Info>();
    for (const item of result.data.data.rows) {
      const meta: Repo = JSON.parse(item[RowEnum.REPO])[0];
      const repo = meta.name;
      const source_value: SourceValue = JSON.parse(meta.sourcevalue);
      const url = source_value[RowEnum.URL] ?? '';
      const addition = Number(item[RowEnum.ADDITION] ?? 0);
      const deletion = Number(item[RowEnum.DELETION] ?? 0);
      if (addition === 0 && deletion === 0) {
        continue;
      }
      let v = infos.get(repo);
      if (v !== undefined) {
        v.addition += addition;
        v.deletion += deletion;
      } else {
        v = {
          repo,
          addition,
          deletion,
          url,
        };
      }
      infos.set(repo, v);
    }
    let markdown = `This page records summary statistics on the number of contributions deepin has made to upstream. The corresponding contributions have been submitted to the upstream.\n`;
    markdown += `\n Note: Contributions submitted upstream do not always use the email of the deepin or uniontech domains, and contributions that are not merged in will be counted as well.\n`;
    markdown += `| Name | Contributions | Repository |\n`;
    markdown += `| --- | --- | --- |\n`;
    for (const [key, value] of infos) {
      const line = `| ${value.repo} | ${value.addition + value.deletion} | ${
        value.url
      } |\n`;
      markdown += line;
    }

    const context = {
      owner: this.settings.config.github.owner,
      repo: 'developer-center',
    };

    const octokit = new Octokit({
      auth: await GetToken(this.settings.appInfo(), context),
    });
    const path = `upstream-contributions/README.md`;
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
        message: 'update upstream-contributions',
        content: encode(markdown), // base64
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
    return;
  }
}
