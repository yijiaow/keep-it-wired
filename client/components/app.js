/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Feed } from './feed'
import { Notes } from './notes.js'
import { ErrorBoundary } from './error'
import { interactiveLogin, autoLogin, logout } from '../chrome'

const GOOGLE_USER_ENDPOINT = 'https://www.googleapis.com/plus/v1/people/me'
const GOOGLE_REVOKE_ENDPOINT = 'https://accounts.google.com/o/oauth2/revoke'
const INIT = 0
const USER_LOADED = 1
const FEED_VIEW = 2
const NOTES_VIEW = 3

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { currentView: FEED_VIEW }
    this.handleInteractiveLogin = this.handleInteractiveLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.onUserFetched = this.onUserFetched.bind(this)
    this.handleViewSwitch = this.handleViewSwitch.bind(this)
    this.handleError = this.handleError.bind(this)
  }
  componentDidMount() {
    autoLogin(false, this.onUserFetched, this.handleError)
  }
  handleInteractiveLogin() {
    interactiveLogin(() => {
      this.setState({ loginStatus: USER_LOADED })
    }, this.handleError)
  }
  onUserFetched(user) {
    this.setState({ loginStatus: USER_LOADED, user })
  }
  handleLogout() {
    logout(() => {
      this.setState({ loginStatus: INIT })
    }, this.handleError)
  }
  handleViewSwitch(event) {
    this.setState({ currentView: parseInt(event.currentTarget.id) })
  }
  handleError(error) {
    this.setState({ loginStatus: INIT })
    throw Error(error)
  }
  render() {
    if (this.state.loginStatus === INIT) {
      return (
        <ErrorBoundary>
          <div className="landing-view d-flex flex-column justify-content-around align-self-center align-items-center w-50">
            <img src="../icons/icon_128x128.png" className="landing-icon" />
            <h3>Keep . It . Wired</h3>
            <button
              className="btn btn-block-primary"
              onClick={this.handleInteractiveLogin}
            >
              Signin with Google
            </button>
          </div>
        </ErrorBoundary>
      )
    }
    else if (this.state.loginStatus === USER_LOADED && this.state.user) {
      return (
        <ErrorBoundary>
          <div className="user-account-bar d-flex w-100 justify-content-end align-items-center">
            <h5 className="user-greeting">
              Hello, {this.state.user.displayName}
            </h5>
            <button
              className="btn btn-inline text-highlight"
              onClick={this.handleLogout}
            >
              Log Out
            </button>
          </div>
          {this.state.currentView === FEED_VIEW ? (
            <Feed currentUser={this.state.user} />
          ) : (
            <Notes currentUser={this.state.user} />
          )}
          <nav className="navbar fixed-bottom navbar-dark bg-dark">
            <ul className="navbar-nav d-flex flex-row w-100">
              <li id={FEED_VIEW} className="nav-item" onClick={this.handleViewSwitch}>
                Feed
              </li>
              <li id={NOTES_VIEW} className="nav-item" onClick={this.handleViewSwitch}>
                Notes
              </li>
            </ul>
          </nav>
        </ErrorBoundary>
      )
    }
    else {
      return null
    }
  }
}

ReactDOM.render(<App />, document.querySelector('#app'))
