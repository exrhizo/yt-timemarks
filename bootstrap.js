// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
  resetStorage();
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url: 'options.html'}) 
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "flash") {
      flashIcon();
    }
  }
);

function flashIcon() {
  chrome.browserAction.setIcon({path:"bicon16.png"}, () => {
    setTimeout(() => {
      chrome.browserAction.setIcon({path:"icon16.png"});
    }, 200);
  });
}