const TABLE_NAME = 'roles';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex(TABLE_NAME)
    .del()
    .then(function() {
      // Inserts seed entries
      return knex(TABLE_NAME).insert([
        {
          id: 1,
          name: 'admin',
          defaultRole: false,
        },
        {
          id: 2,
          name: 'user',
          defaultRole: true,
        },
      ]);
    });
};
