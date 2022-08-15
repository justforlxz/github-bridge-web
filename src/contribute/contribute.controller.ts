import { Controller, Post } from '@nestjs/common';
import { ContributeService } from './contribute.service';

@Controller('contribute')
export class ContributeController {
  constructor(private service: ContributeService) {}

  @Post('update')
  async update() {
    return await this.service.update();
  }
}
