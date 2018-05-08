import React, { Component, PureComponent } from 'react'
import fetchData from './fetchData'
class Note extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { hovered: false }
    this.handleHover = this.handleHover.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  handleHover() {
    this.setState({ hovered: !this.state.hovered })
  }
  handleDelete(event) {
    const { id, index } = event.currentTarget.closest('.card').dataset
    this.props.handleDeleteNote(id, parseInt(index))
  }
  render() {
    return (
      <div
        className="card"
        data-id={this.props.note._id}
        data-index={this.props.index}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
      >
        <div className="card-body">
          <h5 className="card-title text-highlight">{this.props.note.title}</h5>
          <p className="card-text">{this.props.note.content}</p>
          {this.state.hovered && (
            <img
              src="icons/rubbish-bin.svg"
              className="delete-btn"
              onClick={this.handleDelete}
            />
          )}
        </div>
      </div>
    )
  }
}
export class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = { active: null }
    this.handleDeleteNote = this.handleDeleteNote.bind(this)
  }
  componentDidMount() {
    fetchData
      .getNotes(this.props.currentUser)
      .then(data => {
        this.setState({ notes: data })
      })
      .catch(err => {
        this.setState({ error: err })
      })
  }
  handleDeleteNote(id, index) {
    fetchData
      .deleteNote(id)
      .then(() => {
        this.setState({
          notes: [
            ...this.state.notes.slice(0, index),
            ...this.state.notes.slice(index + 1)
          ]
        })
      })
      .catch(err => {
        this.setState({ error: err })
      })
  }

  render() {
    if (this.state.error) throw new Error(this.state.error)
    else if (this.state.notes && this.state.notes.length > 0) {
      return (
        <div className="notes-view d-flex flex-wrap justify-content-center">
          {this.state.notes.map((note, index) => (
            <Note
              key={index}
              index={index}
              note={note}
              handleDeleteNote={this.handleDeleteNote}
            />
          ))}
        </div>
      )
    }
    else {
      return <h5>Getting your notes ready...</h5>
    }
  }
}
