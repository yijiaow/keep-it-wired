const { Router } = require('express')
const NoteSchema = require('./models/NoteSchema')

module.exports = function noteRouter() {
  const router = new Router()
  router.post('/new', async (req, res) => {
    const newNote = NoteSchema(req.body)
    console.log(newNote)
    try {
      const savedNote = await newNote.save()
      res.status(201).send(savedNote)
    }
    catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  return router
}
