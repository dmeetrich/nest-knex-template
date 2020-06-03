const TABLE_NAME = 'users';

exports.up = function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
    (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      first_name TEXT,
      second_name TEXT,
      password TEXT,
      role INTEGER REFERENCES roles(id) NOT NULL,
      image_uri TEXT,
      is_deleted BOOLEAN DEFAULT FALSE,
      added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE
    );
  `);
};

exports.down = function down(knex) {
  return knex.schema.raw(`
    DROP TABLE IF EXISTS ${TABLE_NAME};
  `);
};
