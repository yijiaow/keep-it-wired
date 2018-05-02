import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ErrorBoundary } from './error'

export class Feed extends Component {
  constructor() {
    super()
    this.state = {}
    this.renderFeedStory = this.renderFeedStory.bind(this)
  }
  componentDidMount() {
    fetch('http://127.0.0.1:3000/feed')
      .then(res => {
        if (res.status === 500) {
          this.setState({ error: res.statusText })
        }
        return res.json()
      })
      .then(data => {
        this.setState({ channel: data.channel, feedStories: data.stories })
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
    if (this.state.error) {
      throw new Error(this.state.error)
    }
    else if (this.state.feedStories && this.state.feedStories.length > 0) {
      return (
        <div>
          <header className="d-flex justify-content-start align-items-center">
            <h4>Channel: &#x2F; &#x2F; {this.state.channel.title}</h4>
          </header>
          <section className="list-group">
            {this.state.feedStories.map(this.renderFeedStory)}
          </section>
        </div>
      )
    }
    else {
      return <h4>Waiting......</h4>
    }
  }
}

const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <Feed />
      </ErrorBoundary>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))