exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function (table) {
    table.increments();
    table.text('title');
    table.text('genre');
    table.text('description');
    table.text('url');
  }).then(function() {
    return knex.schema.createTable('authors', function (table) {
      table.increments();
      table.text('first');
      table.text('last');
      table.text('bio');
      table.text('url');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books', 'authors');
};
