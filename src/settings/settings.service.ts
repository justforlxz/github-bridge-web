import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { exit } from 'process';

@Injectable()
export class SettingsService {
  private logger: Logger = new Logger('SettingsService');
  constructor() {
    //load APP_PRIVATE_KEY
    const { WORKDIR } = process.env;
    if (WORKDIR === undefined) {
      this.logger.error(`not set WORKDIR.`);
      exit(-1);
    }
    fs.readFileSync(`${WORKDIR}/config.json`);
  }
  appInfo() {
    return {
      APP_ID: 1,
      APP_PRIVATE_KEY: '',
    };
  }
}
