export interface IBranchOptions {
  repo: string;
}

export interface IBranchCreateOptions extends IBranchOptions {
  base_branch?: string;
}

export interface IBranchDeleteOptions extends IBranchOptions {}
