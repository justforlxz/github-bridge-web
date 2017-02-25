import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  async getToken(): Promise<string> {
    return '';
  }
}
