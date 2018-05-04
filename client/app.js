/* global chrome */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Feed } from './feed'
import { ErrorBoundary } from './error'

const GOOGLE_USER_ENDPOINT = 'https://www.googleapis.com/plus/v1/people/me'
const GOOGLE_REVOKE_ENDPOINT = 'https://accounts.google.com/o/oauth2/revoke'
const INIT = 0
const USER_LOADED = 1

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
    this.state = {}
    this.handleInteractiveLogin = this.handleInteractiveLogin.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.onUserFetched = this.onUserFetched.bind(this)
  }
  componentDidMount() {
    this.handleLogin(false)
  }
  handleInteractiveLogin() {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      if (chrome.runtime.lastError) {
        this.setState({ loginStatus: INIT })
      }
      else {
        this.setState({ loginStatus: USER_LOADED })
      }
    })
  }
  handleLogin(interactiveBool) {
    xhrWithAuth(interactiveBool, this.onUserFetched)
  }
  onUserFetched(err, status, statusText, res) {
    if (!err && status === 200) {
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
    else {
      this.setState({ loginStatus: INIT })
    }
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
            <button className="btn btn-inline" onClick={this.handleLogout}>
              Log Out
            </button>
          </div>
          <Feed currentUser={this.state.user} />
        </ErrorBoundary>
      )
    }
    else {
      return null
    }
  }
}

ReactDOM.render(<App />, document.querySelector('#app'))
