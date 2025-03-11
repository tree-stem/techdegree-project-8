var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/books');
});

router.get('/books', asyncHandler(async (req, res) => {
  let books;
  books = await Book.findAll();
  res.render('index', { books: books, title: "Books" });
}));

router.get('/books/new', (req, res) => {
  res.render('new-book', { title: 'New Book' });
});

router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('form-error', { book: book, title: 'New Book', errors: error.errors });
    } else {
      throw error;
    }
  }
}));

router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book: book, title: "Update Book" });
  } else {
    res.render('page-not-found');
  }
}));

router.post('/books/:id', asyncHandler(async (req, res) => {
  console.log(req.body);
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.render('page-not-found');
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book: book, title: "Update Book" });
    } else {
      throw error;
    }
  }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.render('page-not-found');
  }
}));

module.exports = router;
