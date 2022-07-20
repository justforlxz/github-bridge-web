import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { exit } from 'process';

export interface Root {
  github: Github;
}

export interface Github {
  app: App;
  owner: string;
}

export interface App {
  id: number;
  private_key: string;
}

const decode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
const encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

@Injectable()
export class SettingsService {
  private logger: Logger = new Logger('SettingsService');
  private config: Root;
  constructor() {
    //load APP_PRIVATE_KEY
    const { WORKDIR } = process.env;
    if (WORKDIR === undefined) {
      this.logger.error(`not set WORKDIR.`);
      exit(-1);
    }
    this.config = JSON.parse(
      fs.readFileSync(`${WORKDIR}/config.json`).toString(),
    );
  }
  appInfo() {
    return {
      APP_ID: this.config.github.app.id,
      APP_PRIVATE_KEY: this.config.github.app.private_key,
    };
  }
}
