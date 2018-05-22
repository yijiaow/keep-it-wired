const { Router } = require('express')
const Note = require('./models/NoteSchema')

module.exports = function noteRouter() {
  const router = new Router()
  router.get('/', async (req, res, next) => {
    try {
      const notes = await Note.find({ author_id: req.query.user })
      res.status(200).json(notes)
    }
    catch (err) {
      return next(err)
    }
  })
  router.post('/new', async (req, res, next) => {
    try {
      const noteSaved = await Note.create(req.body)
      res.status(201).json(noteSaved)
    }
    catch (err) {
      return next(err)
    }
  })
  router.post('/edit/:id/', async (req, res, next) => {
    try {
      const noteUpdated = await Note.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }).exec()
      res.status(200).json(noteUpdated)
    }
    catch (err) {
      return next(err)
    }
  })
  router.delete('/delete/:id', async (req, res, next) => {
    try {
      const noteDeleted = await Note.findByIdAndRemove(req.params.id)
      res.status(200).json(noteDeleted)
    }
    catch (err) {
      return next(err)
    }
  })
  return router
}
