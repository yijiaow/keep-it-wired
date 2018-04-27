/* global chrome */

window.onload = () => {
  document.querySelector('button').addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message)
        return
      }
      fetch('https://www.googleapis.com/plus/v1/people/me', {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(userInfo => {
          console.log(userInfo)
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}
