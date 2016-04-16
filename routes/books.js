var express = require('express');
var router = express.Router();

var knex = require('../db/knex');
function Books() {
  return knex('books');
}

function Authors() {
  return knex('authors');
}

function JoinedTable() {
  return knex('authors_books');
}

router.get('/books', function(req, res, next) {
  Books().select().then(function(results) {
    res.render('books/displaybooks', {books: results});
  });
});

router.get('/books/new', function(req, res, next) {
  res.render('books/new', {book: {}});
});

router.get('/books/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Books().where({ id: id }).first().then(function(results) {
    res.render('books/edit', { book: results });
  });
});

router.get('/books/:id/delete', function(req, res, next) {
  Books().where({ id: req.params.id }).first().then(function(results) {
    console.log(results.id);
    res.render('books/delete', { books: [results] });
  });
});

router.post('/books', function(req, res, next) {
  Books().insert({
    title: req.body.title,
    genre: req.body.genre,
    cover_image_url: req.body.imgURL,
    description: req.body.description,
    authors: req.body.authors
  }).then(function(result) {
    res.redirect('/books');
  });
});

router.post('/books/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Books().update({ title: req.body.title, genre: req.body.genre, cover_image_url: req.body.imgURL, description: req.body.description, authors: req.body.authors }).where({id: id}).then(function(result) {
    res.redirect('/books/');
  });
});

router.post('/books/:id/delete', function(req, res) {
  Books().where('id', req.params.id).del().then(function(result) {
    res.redirect('/books');
  });
});

module.exports = router;
