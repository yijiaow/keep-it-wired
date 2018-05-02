/* global chrome */

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.from === 'content_script_bundle' && message.subject === 'showPageAction') {
    console.log(sender.tab ? 'from a content script: ' + sender.tab.url : 'from the extension')
    chrome.pageAction.show(sender.tab.id, callback.)
  }
})
