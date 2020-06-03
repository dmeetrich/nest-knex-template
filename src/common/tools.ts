import * as config from 'config';
import * as crypto from 'crypto';
import { assoc, curry, keys, reduce } from 'ramda';
import { generate as randomString } from 'randomstring';

const PASSWORD_SALT: string = config.get('password.passwordSalt');

export const encryptPassword = (password: string): string => {
  return crypto
    .createHmac('sha512', PASSWORD_SALT)
    .update(password)
    .digest('hex');
};

export const getRandomEncryptedPassword = (length: number): string => {
  const password = randomString(length);

  return encryptPassword(password);
};

export const getSelectFields = (tableName: string, fields: string[]): string[] =>
  fields.map(field => `${tableName}.${field}`);

export const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)),
);
