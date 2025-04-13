import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  keyTerms: [String],
});

export default mongoose.models.Library || mongoose.model('Library', LibrarySchema);
