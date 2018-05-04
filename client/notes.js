import React, { Component } from 'react'

export class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = { active: null }
  }
  componentDidMount() {
    fetch(`http://127.0.0.1:3000/note?user=${this.props.currentUser.userId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ notes: data })
      })
      .catch(err => {
        this.setState({ error: err })
      })
  }
  renderNoteCard(note) {
    return (
      <div className="card">
        <div clasName="card-body">
          <h6 className="card-title">{note.title}</h6>
          <p className="card-text">{note.content}</p>
        </div>
      </div>
    )
  }
  render() {
    if (this.state.error) throw new Error(this.state.error)
    else if (this.state.notes && this.state.notes.length > 0) {
      return (
        <div className="notes-view d-flex">
          {this.state.notes.map(this.renderNoteCard)}
        </div>
      )
    }
    else {
      return <h5>Getting your notes ready...</h5>
    }
  }
}
