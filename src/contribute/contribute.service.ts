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
  english() {
    let markdown = `This page records summary statistics on the number of contributions deepin has made to upstream. The corresponding contributions have been submitted and merged into the upstream codebase.\n`;
    markdown += `\nNote: Contributions submitted upstream do not always use the email of the deepin or uniontech domains.\n`;
    markdown += `| Name | Contributions | Repository |\n`;
    markdown += `| --- | --- | --- |\n`;
    return markdown;
  }
  chinese() {
    let markdown = `&#x6B64;&#x9875;&#x9762;&#x5C55;&#x793A;&#x4E86; deepin &#x5BF9;&#x4E0A;&#x6E38;&#x6E90;&#x7801;&#x505A;&#x51FA;&#x7684;&#x8D21;&#x732E;&#x7684;&#x6570;&#x91CF;&#x7EDF;&#x8BA1;&#x3002;&#x4E0E;&#x4E4B;&#x5BF9;&#x5E94;&#x7684;&#x8D21;&#x732E;&#x5747;&#x5DF2;&#x63D0;&#x4EA4;&#x5E76;&#x5408;&#x5165;&#x5230;&#x4E0A;&#x6E38;&#x4EE3;&#x7801;&#x4ED3;&#x5E93;&#x4E2D;&#x3002;\n`;
    markdown += `\n&#x6CE8;&#xFF1A;&#x5BF9;&#x4E0A;&#x6E38;&#x7684;&#x4EE3;&#x7801;&#x8D21;&#x732E;&#x6709;&#x53EF;&#x80FD;&#x4F7F;&#x7528;&#x4E86; deepin &#x6216; uniontech &#x4E4B;&#x5916;&#x57DF;&#x540D;&#x7684;&#x90AE;&#x7BB1;&#x3002;\n`;
    markdown += `| &#x9879;&#x76EE; | &#x8D21;&#x732E;&#x6570;&#x91CF; | &#x4ED3;&#x5E93;&#x5730;&#x5740; |\n`;
    markdown += `| --- | --- | --- |\n`;
    return markdown;
  }
  async upload(filename: string, body: string) {
    const context = {
      owner: this.settings.config.github.owner,
      repo: 'developer-center',
    };

    const octokit = new Octokit({
      auth: await GetToken(this.settings.appInfo(), context),
    });
    const path = `upstream-contributions/${filename}`;
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
      } catch (err) {}

      await octokit.repos.createOrUpdateFileContents({
        ...context,
        path,
        message: 'update upstream-contributions',
        content: encode(body), // base64
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
      if (item[RowEnum.CUR_STATE] === 'Merged') {
        continue;
      }
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
    const a: Info[] = [];
    for (const [key, value] of infos) {
      a.push(value);
    }
    a.sort((a, b) => a.repo.localeCompare(b.repo));

    let chinese = this.chinese();
    let english = this.english();

    for (const value of a) {
      const line = `| ${value.repo} | ${value.addition + value.deletion} | ${
        value.url
      } |\n`;
      chinese += line;
      english += line;
    }

    try {
      await this.upload('README.md', english);
      await this.upload('README_zh.md', chinese);
    } catch (err) {
      throw new Error(err);
    }

    return;
  }
}
