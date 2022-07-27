const decode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
const encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

export { decode, encode };
