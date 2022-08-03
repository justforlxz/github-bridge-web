export interface IBranchOptions {
  repo: string;
}

export interface IBranchCreateOptions extends IBranchOptions {
  base_branch?: string;
}

export interface IBranchPutOptions extends IBranchOptions {
  state: string;
  data: string;
}
