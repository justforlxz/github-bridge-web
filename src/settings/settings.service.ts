import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';

export interface Root {
  github: Github;
  cooperation: Cooperation;
  contribute: Contribute;
}

export interface Contribute {
  header: {
    i18n: {
      [key: string]: string;
    };
  };
}

export interface Cooperation {
  baseUrl: string;
  appKey: string;
  sign: string;
}

export interface Github {
  app: App;
  owner: string;
}

export interface App {
  id: number;
  private_key: string;
}

@Injectable()
export class SettingsService {
  private logger: Logger = new Logger('SettingsService');
  private _config: Root;
  constructor() {
    //load APP_PRIVATE_KEY
    const { WORKDIR, CONFIG_NAME } = process.env;
    if (WORKDIR === undefined) {
      this.logger.error(`not set WORKDIR.`);
      exit(-1);
    }
    this._config = JSON.parse(
      fs.readFileSync(`${WORKDIR}/${CONFIG_NAME}`).toString(),
    );
  }
  get config() {
    return this._config;
  }
  appInfo() {
    return {
      APP_ID: this.config.github.app.id,
      APP_PRIVATE_KEY: this.config.github.app.private_key,
    };
  }
}
