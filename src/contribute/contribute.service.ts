import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Root, Row, RowEnum, Repo, SourceValue } from 'src/types.cooperation';
import { encode } from 'src/functions';
import { SettingsService } from 'src/settings/settings.service';
import { GetToken } from '@justforlxz/tools';
import { Octokit } from '@octokit/rest';

@Injectable()
export class ContributeService {
  private readonly logger: Logger = new Logger(ContributeService.name);
  constructor(
    private readonly axios: HttpService,
    private readonly settings: SettingsService,
  ) {}
  english() {
    let markdown = `This page records summary statistics on the number of contributions deepin has made to upstream. The corresponding contributions have been submitted and merged into the upstream codebase.\n`;
    markdown += `\nNote: Contributions submitted upstream do not always use the email of the deepin or uniontech domains.\n`;
    markdown += `| Name | Lines Changed | Pull Requests | Repository |\n`;
    markdown += `| --- | --- | --- | --- |\n`;
    return markdown;
  }
  chinese() {
    let markdown = `此页面展示了 deepin 对上游源码做出的贡献的数量统计。与之对应的贡献均已提交并合入到上游代码仓库中。\n`;
    markdown += `\n注：对上游的代码贡献有可能使用了 deepin 或 uniontech 之外域名的邮箱。\n`;
    markdown += `| 项目 | 贡献代码行数 | 提交数量 | 仓库地址 |\n`;
    markdown += `| --- | --- | --- | --- |\n`;
    return markdown;
  }
  async upload(filename: string, body: string, debug: boolean) {
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
          content: string;
        };
        contentRef = content.sha;
        if (debug) {
          this.logger.log(content.content.replaceAll('\n', ''));
          this.logger.log(encode(body));
        }
        if (content.content.replaceAll('\n', '') === encode(body)) {
          this.logger.log(`已有相同内容，无需更新。`);
          return;
        }
        this.logger.log(`监测到新内容，正在更新...`);
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
      this.logger.log(`更新成功!`);
    } catch (e) {
      throw e;
    }

    return;
  }

  async update(debug: boolean) {
    const result: Row[] = [];
    let pageIndex = 1;
    do {
      const v = await firstValueFrom(
        this.axios.post<Root>(
          `${this.settings.config.cooperation.baseUrl}/api/v2/open/worksheet/getFilterRows`,
          {
            appKey: this.settings.config.cooperation.appKey,
            sign: this.settings.config.cooperation.sign,
            worksheetId: 'sybddj',
            viewId: '62cbca4b4f0cd46903df571c',
            pageSize: 999,
            pageIndex,
            isAsc: false,
            filters: [],
          },
        ),
      );
      pageIndex += 1;
      if (!v.data.data.rows.length) {
        break;
      }
      result.push(...v.data.data.rows);
    } while (true);

    interface Info {
      repo: string;
      addition: number;
      deletion: number;
      url: string;
      pr: number;
    }

    const infos: Map<string, Info> = new Map<string, Info>();
    for (const item of result) {
      if (item[RowEnum.CUR_STATE] !== 'Merged') {
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
        v.pr += 1;
      } else {
        v = {
          repo,
          addition,
          deletion,
          url,
          pr: 1,
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
      const line = `| ${value.repo} | ${
        value.addition + value.deletion
      } | ${String(value.pr)} | ${value.url} |\n`;
      chinese += line;
      english += line;
    }

    try {
      await this.upload('README.md', english, debug);
      await this.upload('README.zh.md', chinese, debug);
    } catch (err) {
      throw err;
    }

    return;
  }
}
