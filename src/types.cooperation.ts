export interface Root {
  data: Data;
  success: boolean;
  error_code: number;
}

export interface Data {
  rows: Row[];
  total: number;
}

export enum RowEnum {
  ADDITION = '62d0cd424f0cd46903dfb654',
  DELETION = '62ce6ec6d578c6f39c53bd10',
  REPO = '62ce6cc05d203fc6009f7be8',
  URL = '62ce6c135d203fc6009f7bd1',
}

export interface Row {
  rowid: string;
  ctime: string;
  caid: Caid;
  ownerid: Ownerid;
  utime: string;
  '62cbca4b4f0cd46903df5719'?: string;
  '62cbca4b4f0cd46903df571a'?: string;
  '62cbccccd578c6f39c5386a1': string;
  '62cbccccd578c6f39c5386a2': string;
  '62cbccccd578c6f39c5386a3': string;
  '62cbccccd578c6f39c5386a4': string;
  '62cbccccd578c6f39c5386a5'?: string;
  '62cbccccd578c6f39c5386a6': string;
  '62cbccccd578c6f39c5386a7'?: string;
  '62cbccccd578c6f39c5386a8': string;
  '62cbcd734f0cd46903df573d': string;
  '62ce13414f0cd46903df69af': string;
  '62ce153cd578c6f39c539a4c': string;
  '62ce6ec6d578c6f39c53bd10'?: string; // 代码删除行数
  '62ce6ec6d578c6f39c53bd11'?: string;
  '62cfb8b84f0cd46903df8372': string;
  '62d0cd424f0cd46903dfb654'?: string; // 代码新增函数
  '62ce6cc05d203fc6009f7be8': string; // 项目详情
  autoid: number;
  allowdelete: boolean;
  controlpermissions: string;
}

export interface Caid {
  accountId: string;
  fullname: string;
  avatar: string;
  status: number;
}

export interface Ownerid {
  accountId: string;
  fullname: string;
  avatar: string;
  status: number;
}

export interface Repo {
  type: number;
  sid: string;
  sidext: string;
  accountId: string;
  fullname: string;
  avatar: string;
  name: string;
  ext1: string;
  ext2: string;
  link: string;
  projectId: string;
  sourcevalue: string;
}

export interface SourceValue {
  wsid: string;
  rowid: string;
  status: number;
  '62ce54f74f0cd46903df705d': string;
  '62ce54f74f0cd46903df705f': string[];
  unreads: boolean;
  autoid: number;
  '62ce6c135d203fc6009f7bd1': string;
  discussunreads: boolean;
  allowedit: boolean;
  allowdelete: boolean;
  controlpermissions: string;
}
