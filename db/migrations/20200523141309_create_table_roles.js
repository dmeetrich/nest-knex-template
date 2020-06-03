const TABLE_NAME = 'roles';

exports.up = function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
    (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      default_role BOOLEAN DEFAULT FALSE
    );
  `);
};

exports.down = function down(knex) {
  return knex.schema.raw(`
    DROP TABLE IF EXISTS ${TABLE_NAME};
  `);
};
