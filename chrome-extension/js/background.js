/* global chrome */

let currentUser
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === 'popup_script' && message.action === 'createTab') {
    currentUser = message.currentUser
    chrome.tabs.create({ url: message.url }, tab => {
      chrome.tabs.insertCSS(tab.id, { file: 'css/bootstrap.min.css' })
      chrome.tabs.insertCSS(tab.id, { file: 'css/content.css' })
      chrome.tabs.executeScript(tab.id, { file: 'js/content_script_bundle.js' })
    })
  }
  if (message.from === 'content_script' && message.action === 'getUser') {
    sendResponse(currentUser)
  }
})
