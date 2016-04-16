var express = require('express');
var router = express.Router();
var _ = require('underscore');
var validate = require('../lib/validations.js');

var knex = require('../db/knex');
function Authors() {
  return knex('authors');
}

function Books() {
  return knex('books')
}

function JoinedTable() {
  return knex('authors_books');
}

router.get('/authors', function(req, res, next) {

  Authors().select().then(function(getauthors) {
    JoinedTable().innerJoin('books', 'authors_books.book_id', 'books.id').select().then(function(getbooks) {

      for (var i = 0; i < getauthors.length; i++) {
        var author = getauthors[i];

        author.books = _.filter(getbooks, function(book) {
          return book.author_id === author.id;
        });
        console.log(author.books);
      }
      res.render('authors/displayauthors', {authors: getauthors});
    });
  });
});

router.get('/authors/new', function(req, res, next) {
  Books().select('title').then(function(books) {
    console.log(books);
    res.render('authors/new', {author: {}, books: books});
  });
});

router.get('/authors/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Authors().where({ id: id }).first().then(function(results) {
    Books().select('title').then(function(books) {
      res.render('authors/edit', { author: results, books: books });
    });
  });
});

router.get('/authors/:id/delete', function(req, res, next) {

  Authors().where({ id: req.params.id }).first().then(function(getauthors) {
    JoinedTable().innerJoin('books', 'authors_books.book_id', 'books.id').select().then(function(getbooks) {

      var author = getauthors.id;

      author.books = _.filter(getbooks, function(book) {
        return book.author_id === author;
      });
      res.render('authors/delete', { authors: [getauthors] });
    });
  });
});

router.post('/authors', function(req, res, next) {
  Authors().insert({
    first: req.body.firstname,
    last: req.body.lastname,
    url: req.body.portraitURL,
    bio: req.body.biography
  }).then(function(result) {
    res.redirect('/authors');
  });
});

router.post('/authors/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Authors().update({
    first: req.body.firstname,
    last: req.body.lastname,
    url: req.body.portraitURL,
    bio: req.body.biography
  }).where({ id: id }).then(function(result) {
    res.redirect('/authors/');
  });
});

router.post('/authors/:id/delete', function(req, res) {
  Authors().where('id', req.params.id).del().then(function(result) {
    res.redirect('/authors');
  });
});


module.exports = router;
