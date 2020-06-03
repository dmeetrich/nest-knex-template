const { camelCase, mapKeys } = require('lodash');
const { cond, equals, identity, map, pipe, T, type, when } = require('ramda');

// NOTE! we cannot use lodash snakeCase as it replaces {*,_,?} to empty string
function toSnakeCase(value) {
  return value.replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`);
}

module.exports = {
  app: {
    port: 3000,
  },
  jwt: {
    jwtSecret: 'MY_L1TTL3_P0NY',
    jwtSession: {
      session: false,
    },
  },
  password: {
    defaultPasswordLength: 6,
    passwordSalt: '7f7a3cce5020ee2c1fa5dbc90ac092726054323c',
  },
  knex: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'template_dev',
      user: 'postgres',
      password: 'qwerty123',
    },
    pool: {
      min: 1,
      max: 15,
    },
    migrations: {
      directory: './db/migrations',
      tableName: '__migrations',
      disableMigrationsListValidation: true,
    },
    seeds: {
      directory: './db/seeds/dev',
    },
    wrapIdentifier: (value, origImpl) => origImpl(toSnakeCase(value)),
    // overly simplified snake_case -> camelCase converter
    postProcessResponse: result => {
      if (Array.isArray(result)) {
        return result.map(
          pipe(
            row => mapKeys(row, (v, k) => camelCase(k)),
            map(
              cond([
                [pipe(type, equals('Object')), row => mapKeys(row, (v, k) => camelCase(k))],
                [
                  pipe(type, equals('Array')),
                  map(
                    when(pipe(type, equals('Object')), row => mapKeys(row, (v, k) => camelCase(k))),
                  ),
                ],
                [T, identity],
              ]),
            ),
          ),
        );
      }

      if (result.rows) {
        return result.rows.map(row => mapKeys(row, (v, k) => camelCase(k)));
      }

      return mapKeys(result, (v, k) => camelCase(k));
    },
  },
};
