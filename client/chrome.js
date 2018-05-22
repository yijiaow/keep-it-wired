/* global chrome */

const GOOGLE_USER_ENDPOINT = 'https://www.googleapis.com/plus/v1/people/me'
const GOOGLE_REVOKE_ENDPOINT = 'https://accounts.google.com/o/oauth2/revoke'

function fetchUserWithAuth(interactive, onSuccess, onFailure) {
  var accessToken
  var retry = true
  getToken()

  function getToken() {
    chrome.identity.getAuthToken({ interactive: interactive }, token => {
      if (chrome.runtime.lastError) {
        onFailure(chrome.runtime.lastError)
        return
      }
      accessToken = token
      getUser()
    })
  }
  function getUser() {
    fetch(GOOGLE_USER_ENDPOINT, {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
      .then(res => {
        if (!res.ok && retry) {
          retry = false
          chrome.identity.removeCachedAuthToken(
            { token: accessToken },
            getToken
          )
        }
        else {
          return res.json()
        }
      }).then(userInfo => {
        const username = userInfo.displayName.toLowerCase().replace(' ', '_')
        const user = {
          userId: userInfo.id,
          username: username,
          displayName: userInfo.displayName
        }
        onSuccess(user)
      })
      .catch(onFailure)
  }
}
const _chrome = {
  interactiveLogin(onSuccess, onFailure) {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      if (chrome.runtime.lastError) {
        onFailure(chrome.runtime.lastError)
      }
      onSuccess()
    })
  },
  autoLogin(interactive, onSuccess, onFailure) {
    fetchUserWithAuth(interactive, onSuccess, onFailure)
  },
  logout(onSuccess, onFailure) {
    chrome.identity.getAuthToken({ interactive: false }, token => {
      if (chrome.runtime.lastError) {
        onFailure(chrome.runtime.lastError)
        return
      }
      chrome.identity.removeCachedAuthToken({ token }, () => {
        fetch(`${GOOGLE_REVOKE_ENDPOINT}?token=${token}`)
          .then(() => onSuccess())
          .catch(onFailure)
      })
    })
  }
}

module.exports = _chrome
