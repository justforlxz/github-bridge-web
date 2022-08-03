const decode = (str: string): string => Buffer.from(str, 'base64').toString();
const encode = (str: string): string => Buffer.from(str).toString('base64');

export { decode, encode };
