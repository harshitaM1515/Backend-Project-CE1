// index.js

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.use(express.json());

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages:Number,
  genre:String,
  yearPublished: Number,
  publisher: String,
  price: Number
});

const Book = mongoose.model('Book', bookSchema);

app.post('/books', async (req, res) => {
  const { title, author,pages,genre,yearPublished,publisher,price } = req.body;
  try {
    const newBook = new Book({ title, author,pages,genre,yearPublished,publisher,price });
    await newBook.save();
    // console.log(newBook);
    res.json(newBook);
  } catch (err) {
    res.status(500).send('Error creating book');
  }
});

app.get('/books', async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.json(allBooks);
  } catch (err) {
    res.status(500).send('Error fetching books');
  }
});

app.get('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);
  } catch (err) {
    res.status(500).send('Error fetching book');
  }
});

app.put('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const { title, author,pages,genre,yearPublished,publisher,price } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, { title, author,pages,genre,yearPublished,publisher,price }, { new: true });
    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(500).send('Error updating book');
  }
});

app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    await Book.findByIdAndDelete(bookId);
    res.send('Book deleted');
  } catch (err) {
    res.status(500).send('Error deleting book');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
