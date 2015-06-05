function restore_options() {
  chrome.storage.sync.get(
    null, function(items) {
    var i = 0;
    var elem = document.getElementById("boilerplates");
    elem.innerHTML = "";
    for(key in items) {
      console.log(key+" = "+items[key]);
      elem.innerHTML += "<div class='line' id='item"+(i)+"'><input type='text'/><button class='delete' id='button"+i+"'>delete</button></div>";
      var tkey = key;
      var tvalue = items[key];
      var input = document.getElementById("item"+i).getElementsByTagName("input")[0];
      input.setAttribute("value", tkey);
      input.dataset.origname = key;
      input.dataset.origvalue = tvalue;
      var button = document.getElementById("button"+i);
      button.innerHTML = "del";
      button.dataset.origname = key;
      console.log(button);
      i++;
    }
    setTimeout(function() {
      var buttons = document.getElementsByClassName("delete");
      for(var i = 0; i < buttons.length; i++) {
        console.log("adding click handler "+i);
        buttons[i].onclick = function(e) {
          console.log("removing "+e.target.dataset.origname);
          chrome.storage.sync.remove(e.target.dataset.origname);
        };
      }
    }, 100);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
chrome.storage.onChanged.addListener(restore_options);
document.getElementById("save").onclick = function() {
  chrome.storage.onChanged.removeListener(restore_options);
  
  var elems = document.getElementsByClassName("line");
  for(var i = 0; i < elems.length; i++) {
    var line = elems[i];
    var input = line.getElementsByTagName("input")[0];
    if(input.value == input.dataset.origname) {
      console.log("unchanged "+input.value);
    } else {
      console.log("changed "+input.value+" "+input.dataset.origname);
      chrome.storage.sync.remove(input.dataset.origname);
      var obj = {};
      obj[input.value] = input.dataset.origvalue;
      chrome.storage.sync.set(obj);
    }
  }
  chrome.storage.onChanged.addListener(restore_options);
  restore_options();
};