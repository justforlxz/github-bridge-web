import { Controller, Post, Query } from '@nestjs/common';
import { ContributeService } from './contribute.service';

@Controller('contribute')
export class ContributeController {
  constructor(private service: ContributeService) {}

  @Post('update')
  async update(@Query('debug') debug = 'false') {
    return await this.service.update(debug === 'true');
  }
}
