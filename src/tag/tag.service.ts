import { GetToken, Context, Root } from '@justforlxz/tools';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { App } from '../types';
import { encode } from 'src/functions';

@Injectable()
export class TagService {
  async create(app: App, context: Context, config: Root) {
    try {
      const octokit = new Octokit({ auth: await GetToken(app, context) });
      const createTagResponse = await octokit.request(
        'POST /repos/{owner}/{repo}/git/tags',
        {
          ...context,
          message: config.data.message,
          object: config.data.object,
          tag: config.data.tag,
          type: 'commit',
          tagger: {
            name: config.data.tagger.name,
            email: config.data.tagger.email,
            date: (() => {
              const date = new Date();
              return date.toISOString();
            })(),
          },
        },
      );

      if (createTagResponse.status !== 201) {
        throw 'response not 201';
      }

      const tag = config.data.tag;

      const createRef = await octokit.request(
        'POST /repos/{owner}/{repo}/git/refs',
        {
          ...context,
          ref: `refs/tags/${tag}`,
          sha: createTagResponse.data.sha,
        },
      );

      if (createRef.status !== 201) {
        throw `create ref failed! code: ${createRef.status}`;
      }
    } catch (err) {
      throw `data error, please check!`;
    }
  }

  async check(app: App, context: Context, config: Root) {
    let token;

    try {
      token = await GetToken(app, context);
    } catch (err) {
      throw `get token failed.`;
    }

    const octokit = new Octokit({ auth: token });

    try {
      await octokit.git.getCommit({
        ...context,
        commit_sha: config.data.object,
      });
    } catch (err) {
      throw `error commit hash, please check!`;
    }

    const tag = config.data.tag;
    const sha = config.data.object;
    let tag_sha = '';
    // 检查 tag 是否存在

    let check;
    try {
      check = await octokit.git.getRef({
        ...context,
        ref: `tags/${config.data.tag}`,
      });
    } catch (err) {
      throw 'get ref failed.';
    }

    if (check.data.object.type === 'tag') {
      tag_sha = check.data.object.sha;
    } else if (check.data.object.type === 'commit') {
      if (check.data.object.sha !== sha) {
        throw `tag <${tag}> does not match hash <${sha}> <${tag_sha}>`;
      } else {
        throw `tag <${tag}> is commit tag <${check.data.object.sha}>, it's already exist.`;
      }
    }

    try {
      const checkSha = await octokit.git.getTag({
        ...context,
        tag_sha,
      });
      if (checkSha.data.object.sha === sha) {
        throw `tag <${tag}> exist.`;
      } else {
        throw `tag <${tag}> does not match hash <${sha}>`;
      }
    } catch (e) {
      throw `ref exist, but tag <${tag}> not exist.`;
    }
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
      throw e;
    }
  }
}
