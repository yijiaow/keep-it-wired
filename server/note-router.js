const { Router } = require('express')
const Note = require('./models/NoteSchema')

module.exports = function noteRouter() {
  const router = new Router()
  router.get('/', async (req, res) => {
    try {
      const notes = await Note.find({ author_id: req.query.user })
      res.status(200).send(notes)
    }
    catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  })
  router.post('/new', async (req, res) => {
    try {
      const noteSaved = await Note.create(req.body)
      res.status(201).send(noteSaved)
    }
    catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  router.post('/edit/:id/', async (req, res) => {
    try {
      const noteUpdated = await Note.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }).exec()
      res.status(200).json(noteUpdated)
    }
    catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  })
  router.delete('/delete/:id', async (req, res) => {
    try {
      await Note.findByIdAndRemove(req.params.id)
      res.status(200).send('Note successfully deleted].')
    }
    catch (err) {
      res.status(500).send(err)
    }
  })
  return router
}
