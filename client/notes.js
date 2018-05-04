import React, { Component } from 'react'

export class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = { active: null }
    this.handleHover = this.handleHover.bind(this)
    this.handleDeleteNote = this.handleDeleteNote.bind(this)
    this.renderNoteCard = this.renderNoteCard.bind(this)
  }
  componentDidMount() {
    fetch(`http://127.0.0.1:3000/note?user=${this.props.currentUser.userId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ notes: data })
      })
      .catch(err => {
        this.setState({ error: err })
      })
  }
  handleHover(event) {
    this.setState({ active: event.currentTarget.dataset.id })
  }
  handleDeleteNote(event) {
    const { id, index } = event.currentTarget.closest('.card').dataset
    const updatedNoteList = this.state.notes
      .slice(0, index)
      .concat(this.state.notes.slice(index + 1))
    fetch(`http://127.0.0.1:3000/note/delete/${id}`, {
      method: 'DELETE'
    })
      .then(this.setState({ notes: updatedNoteList }))
      .catch(err => {
        this.setState({ error: err })
      })
  }
  renderNoteCard(note, key) {
    const $deleteBtn = note._id === this.state.active && (
      <button className="btn" onClick={this.handleDeleteNote}>
        Delete
      </button>
    )
    return (
      <div
        className="card"
        key={key}
        data-index={key}
        data-id={note._id}
        onMouseOver={this.handleHover}
      >
        <div className="card-body">
          <h5 className="card-title text-highlight">{note.title}</h5>
          <p className="card-text">{note.content}</p>
          {$deleteBtn}
        </div>
      </div>
    )
  }
  render() {
    if (this.state.error) throw new Error(this.state.error)
    else if (this.state.notes && this.state.notes.length > 0) {
      return (
        <div className="notes-view d-flex flex-wrap justify-content-around align-content-between">
          {this.state.notes.map(this.renderNoteCard)}
        </div>
      )
    }
    else {
      return <h5>Getting your notes ready...</h5>
    }
  }
}
