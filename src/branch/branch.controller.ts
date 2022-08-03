import { Controller, Post, Param, Body, Delete } from '@nestjs/common';
import { IBranchCreateOptions, IBranchDeleteOptions } from 'src/types.branch';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private service: BranchService) {}

  @Post(':branch')
  async create(
    @Param('branch') branch: string,
    @Body() body: IBranchCreateOptions,
  ) {
    return await this.service.create(branch, body);
  }

  @Delete(':branch')
  async delete(
    @Param('branch') branch: string,
    @Body() body: IBranchDeleteOptions,
  ) {
    return await this.service.delete(branch, body);
  }
}
