const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
  title: { type: String, default: 'Untitled' },
  content: { type: String, required: true },
  author_id: { type: String, required: true },
  article_id: { type: String, required: true },
  article_link: { type: String, required: true }
})

module.exports = mongoose.model('Note', NoteSchema)
