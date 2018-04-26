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
      <a
        href={story.link}
        key={key}
        className="list-group-item list-group-item-action flex-column align-items-start"
      >
        <div className="d-flex w-100 justify-content-between">
          <h5 className="story-title mb-1">{story.title}</h5>
          <small className="no-wrap">{story.pubdate}</small>
        </div>
        <p className="mb-1">{story.summary}</p>
      </a>
    )
  }
  render() {
    const feedStories = this.state.feedStories
    if (feedStories && feedStories.length > 0) {
      return (
        <div>
          <header className="d-flex justify-content-start align-items-center">
            <h4>Channel: &#x2F; &#x2F; {this.state.channel.title}</h4>
          </header>
          <section className="list-group">
            {feedStories.map(this.renderFeedStory)}
          </section>
        </div>
      )
    }
    else {
      return <h4>Waiting......</h4>
    }
  }
}

ReactDOM.render(<Feed />, document.querySelector('#app'))
