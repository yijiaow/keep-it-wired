/* global chrome */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const $viewport = document.querySelector('body')
const $injectApp = document.createElement('div')

$injectApp.id = 'root'
if ($viewport) $viewport.prepend($injectApp)

export class InjectApp extends Component {
  constructor() {
    super()
    this.state = { noteFormOpen: false }
    this.handleNoteSubmit = this.handleNoteSubmit.bind(this)
    this.openNoteForm = this.openNoteForm.bind(this)
    this.renderNoteForm = this.renderNoteForm.bind(this)
  }
  componentDidMount() {
    chrome.runtime.sendMessage(
      { from: 'content_script', action: 'getUser' },
      res => {
        this.setState({ currentUser: res })
      }
    )
  }
  handleNoteSubmit(event) {
    event.preventDefault()
    const $form = event.target
    const formData = new FormData($form)
    const data = Object.create(Object)
    for (let [key, value] of formData.entries()) {
      data[key] = value
    }
    const noteData = Object.assign(data, {
      author_id: this.state.currentUser.userId,
      article_link: '#',
      article_id: '#'
    })
    fetch('http://127.0.0.1:3000/note/new', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(noteData)
    })
      .then(res => res.json())
      .catch(err => console.error(err))
    $form.reset()
    this.setState({ noteFormOpen: false })
  }
  openNoteForm() {
    this.setState({ noteFormOpen: true })
  }
  renderNoteForm() {
    return (
      <form
        className="d-flex flex-column justify-content-between align-items-center"
        onSubmit={this.handleNoteSubmit}
      >
        <input
          className="form-control"
          name="title"
          type="text"
          placeholder="Title"
        />
        <h5 className="form-text align-self-start">
          By: {this.state.currentUser.displayName}
        </h5>
        <textarea className="form-control form-control-sm" name="content" />
        <button type="submit" className="btn btn-secondary">
          Save
        </button>
      </form>
    )
  }
  render() {
    return (
      <div className="content-layer">
        <button className="btn" onClick={this.openNoteForm}>
          Take note
        </button>
        {this.state.noteFormOpen && this.renderNoteForm()}
      </div>
    )
  }
}

ReactDOM.render(<InjectApp />, document.querySelector('#root'))
