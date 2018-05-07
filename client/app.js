/* global chrome */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Feed } from './feed'
import { Notes } from './notes.js'
import { ErrorBoundary } from './error'

const GOOGLE_USER_ENDPOINT = 'https://www.googleapis.com/plus/v1/people/me'
const GOOGLE_REVOKE_ENDPOINT = 'https://accounts.google.com/o/oauth2/revoke'
const INIT = 0
const USER_LOADED = 1
const FEED_VIEW = 2
const NOTES_VIEW = 3

function xhrWithAuth(interactive, callback) {
  var accessToken
  var retry = true
  getToken()

  function getToken() {
    chrome.identity.getAuthToken({ interactive: interactive }, function (token) {
      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError)
        return
      }
      accessToken = token
      getUser()
    })
  }
  function getUser() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', GOOGLE_USER_ENDPOINT)
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
    xhr.onload = getUserComplete
    xhr.send()
  }
  function getUserComplete() {
    if (this.status === 401 && retry) {
      retry = false
      chrome.identity.removeCachedAuthToken({ token: accessToken }, getToken)
    }
    else {
      callback(null, this.status, this.statusText, this.response)
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { currentView: FEED_VIEW }
    this.handleInteractiveLogin = this.handleInteractiveLogin.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.onUserFetched = this.onUserFetched.bind(this)
    this.handleViewSwitch = this.handleViewSwitch.bind(this)
  }
  componentDidMount() {
    this.handleLogin(false)
  }
  handleInteractiveLogin() {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      if (chrome.runtime.lastError) {
        this.setState({ loginStatus: INIT, error: chrome.runtime.lastError })
      }
      else {
        this.setState({ loginStatus: USER_LOADED, currentView: FEED_VIEW })
      }
    })
  }
  handleLogin(interactiveBool) {
    xhrWithAuth(interactiveBool, this.onUserFetched)
  }
  onUserFetched(err, status, statusText, res) {
    if (err && !status === 200) {
      return this.setState({ loginStatus: INIT, error: err })
    }
    const userInfo = JSON.parse(res)
    const username = userInfo.displayName.toLowerCase().replace(' ', '_')
    this.setState({
      loginStatus: USER_LOADED,
      user: {
        userId: userInfo.id,
        username: username,
        displayName: userInfo.displayName
      }
    })
  }
  handleLogout() {
    chrome.identity.getAuthToken({ interactive: false }, token => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message)
        return
      }
      chrome.identity.removeCachedAuthToken({ token }, () => {
        fetch(`${GOOGLE_REVOKE_ENDPOINT}?token=${token}`)
          .then(() => {
            this.setState({ loginStatus: INIT })
          })
          .catch(err => {
            console.error(err)
          })
      })
    })
  }
  handleViewSwitch(event) {
    this.setState({ currentView: parseInt(event.currentTarget.id) })
  }
  render() {
    if (this.state.loginStatus === INIT) {
      return (
        <div className="landing-view d-flex flex-column justify-content-around align-self-center align-items-center w-50">
          <img src="icon_128x128.png" className="landing-icon" />
          <h3>Keep . It . Wired</h3>
          <button
            className="btn btn-block-primary"
            onClick={this.handleInteractiveLogin}
          >
            Signin with Google
          </button>
        </div>
      )
    }
    else if (this.state.loginStatus === USER_LOADED) {
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
              <li id={2} className="nav-item" onClick={this.handleViewSwitch}>
                Feed
              </li>
              <li id={3} className="nav-item" onClick={this.handleViewSwitch}>
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
