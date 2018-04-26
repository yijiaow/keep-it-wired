import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export class Feed extends Component {
  constructor() {
    super()
    this.state = {}
    this.renderFeedStory = this.renderFeedStory.bind(this)
  }
  componentDidMount() {
    fetch('http://127.0.0.1:3000/feed')
      .then(res => res.json())
      .then(data => {
        this.setState({ channel: data.channel, feedStories: data.stories })
      })
      .catch(err => {
        console.error(err)
      })
  }
  renderFeedStory(story, key) {
    return (
      <li key={key}>
        <h5>{story.title}</h5>
        <a href={story.link}>Read more</a>
        <p>{story.summary}</p>
      </li>
    )
  }
  render() {
    const feedStories = this.state.feedStories
    console.log(feedStories)
    if (this.state.feedStories && this.state.feedStories.length > 0) {
      return (
        <div>
          <h3>{this.state.channel.title}</h3>
          <ul>{feedStories.map(this.renderFeedStory)}</ul>
        </div>
      )
    }
    else {
      return <h3>Waiting......</h3>
    }
  }
}

ReactDOM.render(<Feed />, document.querySelector('#app'))
