// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
  resetStorage();
});