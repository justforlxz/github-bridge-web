import { GetToken, Context, Tag, Upload, Root, Check } from '@justforlxz/tools';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { App } from '../types';

const decode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
const encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

async function uploadFile(octokit: Octokit, root: Root, context: Context) {
  const path = `tags/${root.repo}.json`;
  const branch = `request-${root.repo}-${root.data.tag}`;
  const masterRef = await octokit.git.getRef({
    ...context,
    ref: 'heads/master',
  });

  try {
    await octokit.git.deleteRef({
      ...context,
      ref: `heads/${branch}`,
    });
  } catch (e) {
    console.error(e);
  }

  await octokit.git.createRef({
    ...context,
    ref: `refs/heads/${branch}`,
    sha: masterRef.data.object.sha,
  });

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

    // 提交 pull request
    await octokit.pulls.create({
      ...context,
      head: `${context.owner}:${branch}`,
      base: 'master',
      title: `[${root.repo}] request create tag ${root.data.tag}`,
    });
  } catch (e) {
    console.error(e);
    await octokit.git.deleteRef({
      ...context,
      ref: `heads/${branch}`,
    });
    throw new Error(e);
  }
}

@Injectable()
export class PullsService {
  async create(app: App, context: Context, config: Root) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    return await Tag(octokit, config);
  }

  async check(app: App, context: Context, config: Root) {
    const octokit = new Octokit({ auth: await GetToken(app, context) });
    return await Check(octokit, config);
  }
}
