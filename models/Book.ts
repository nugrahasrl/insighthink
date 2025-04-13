import { Schema, model, models } from 'mongoose';

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model already exists, otherwise create it
const Book = models.Book || model('Book', BookSchema);

export default Book;