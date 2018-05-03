/* global chrome */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const $viewport = document.querySelector('body')
const $injectApp = document.createElement('div')

$injectApp.id = 'root'
if ($viewport) $viewport.prepend($injectApp)

const styles = {
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: 'transparent'
  }
}
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
    const formData = new FormData(event.target)
    const data = Object.create(Object)
    for (let [key, value] of formData.entries()) {
      data[key] = value
    }
    data['author_id'] = this.state.currentUser.userId
    fetch('http://127.0.0.1:3000/note/new', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .catch(err => console.error(err))
  }
  openNoteForm() {
    this.setState({ noteFormOpen: true })
  }
  renderNoteForm() {
    return (
      <form onSubmit={this.handleNoteSubmit}>
        <input
          className="form-control"
          name="title"
          type="text"
          placeholder="Title"
        />
        <textarea className="form-control form-control-sm" name="content" />
        <button type="submit" className="btn btn-primary mb-2">
          Save
        </button>
      </form>
    )
  }
  render() {
    return (
      <div className="content-layer" style={styles.root}>
        <button className="btn btn-primary" onClick={this.openNoteForm}>
          New note
        </button>
        {this.state.noteFormOpen && this.renderNoteForm()}
      </div>
    )
  }
}

ReactDOM.render(<InjectApp />, document.querySelector('#root'))
