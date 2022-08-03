import {
  Controller,
  Post,
  Put,
  Query,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { IBranchCreateOptions, IBranchPutOptions } from 'src/types.branch';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private service: BranchService) {}

  @Post(':branch')
  async create(
    @Param('branch') branch: string,
    @Body() body: IBranchCreateOptions,
  ) {
    try {
      await this.service.create(branch, body);
      return {
        code: 200,
        message: `create branch ${branch} successd.`,
      };
    } catch (err) {
      return {
        code: 201,
        message: `create branch ${branch} failed.`,
        error: err,
      };
    }
  }

  @Put(':branch')
  async lock(@Param('branch') branch: string, @Body() body: IBranchPutOptions) {
    try {
      throw new Error('not suppoted');
      await this.service.lock(body, branch);
      return {
        code: 200,
        message: `lock branch ${branch} successd.`,
      };
    } catch (err) {
      return {
        code: 201,
        message: `lock branch ${branch} failed.`,
        error: err,
      };
    }
  }

  @Delete(':branch')
  async delete(@Param('branch') branch: string, @Query('repo') repo: string) {
    try {
      await this.service.delete(repo, branch);
      return {
        code: 200,
        message: `delete branch ${branch} successd.`,
      };
    } catch (err) {
      return {
        code: 201,
        message: `delete branch ${branch} failed.`,
        error: err,
      };
    }
  }
}
