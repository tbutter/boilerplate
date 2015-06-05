function initMenus(data) {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      type: "normal",
      id: "save",
      title: "save boilerplate",
      contexts: ["editable"]
    }, function() { console.log("save created"); console.log(chrome.runtime.lastError);});
    chrome.contextMenus.create({
      type: "normal",
      id: "config",
      title: "open config",
      contexts: ["editable"]
    });
    for(key in data) {
      chrome.contextMenus.create({
        type: "normal",
        id: "paste-"+key,
        title: key,
        contexts: ["editable"]
      });
    }
  };

chrome.storage.onChanged.addListener(function() {
  chrome.storage.sync.get(null, initMenus);
});

chrome.contextMenus.onClicked.addListener(function(e) {
  if(e.menuItemId == "save") {
    chrome.tabs.executeScript({
        code: 'document.activeElement.innerHTML'
      }, function(result) {
        var key = new Date().toString();
        var obj = {};
        obj[key] = result[0];
        chrome.storage.sync.set(obj);
      });
  } else if(e.menuItemId == "config"){
    chrome.runtime.openOptionsPage();
  } else {
    var key = e.menuItemId.substring(6);
    chrome.storage.sync.get([key], function(data) {
      chrome.tabs.executeScript({
        code: 'document.activeElement.innerHTML += '+JSON.stringify(data[key])+';'
        });
    });
  }
});

chrome.storage.sync.get(null, initMenus);