const { Router } = require('express')
const Note = require('./models/NoteSchema')

module.exports = function noteRouter() {
  const router = new Router()
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
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  return router
}
